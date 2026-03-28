import "@/lib/arktype";

import { os } from "@orpc/server";
import { createId } from "@paralleldrive/cuid2";
import Ably from "ably";
import { type } from "arktype";
import { and, eq, isNull, sql } from "drizzle-orm";
import { sendAblyEvent } from "../ably";
import { getServerSession } from "../auth/session";
import { PAGE_SIZE, SORTABLE_FIELDS_LIST } from "../constants";
import { db } from "../db";
import { pawprints, responses, signatures, users } from "../db/schema";
import { publishValidation, respondValidation } from "../utils";

const pub = os
	.errors({
		// <-- common errors

		NOT_LOGGED_IN: {
			message: "You must be logged in to perform this action.",
			status: 401,
		},
		SIGNING_EXPIRED: {
			message: "The signing period for this pawprint has expired.",
			status: 403,
		},
		DOES_NOT_EXIST: {
			message: "The requested pawprint does not exist.",
			status: 404,
		},
		GUEST_NOT_ALLOWED: {
			message: "You must be a member of RIT to perform this action.",
			status: 401,
		},
		ONLY_ADMIN_ALLOWED: {
			message: "You must be an admin to perform this action.",
			status: 401,
		},
	})
	.$context<{ headers: Headers }>();

const sessionOptional = pub.use(
	async ({ context: { headers }, next, ...rest }) => {
		const session = await getServerSession(headers);

		return next({
			...rest,
			context: {
				session,
			},
		});
	},
);

const sessionRequired = sessionOptional.use(
	async ({ context: { session }, errors, next }) => {
		if (!session?.user) {
			throw errors.NOT_LOGGED_IN();
		}

		return next({
			context: {
				session,
			},
		});
	},
);

const ritRequired = sessionRequired.use(
	async ({
		context: {
			session: { user },
		},
		errors,
		next,
	}) => {
		if (user.accountType === "GUEST") throw errors.GUEST_NOT_ALLOWED();

		return next({
			context: {
				user,
			},
		});
	},
);

const adminRequired = sessionRequired.use(
	async ({
		context: {
			session: { user },
		},
		errors,
		next,
	}) => {
		if (user.accountType !== "ADMIN") throw errors.ONLY_ADMIN_ALLOWED();

		return next({
			context: {
				user,
			},
		});
	},
);

export const getAblySubscribeToken = sessionRequired.handler(
	async ({
		context: {
			session: {
				user: { id },
			},
		},
	}) => {
		const ably = new Ably.Rest({ key: process.env.ABLY_SUBSCRIBE_KEY });

		return await ably.auth.requestToken({ clientId: id });
	},
);

export const getPawprints = pub
	.input(
		type({
			"tags?": "string[]",
			"before?": "Date",
			"after?": "Date",
			"search?": "string",
			"flags?": "string[]",
			"page?": "number",
			orderBy: type({
				field: type.enumerated(...SORTABLE_FIELDS_LIST),
				direction: "'asc' | 'desc'",
			}),
		}),
	)
	.handler(async ({ input }) => {
		if (!input.page) input.page = 0;

		const query = db.query.pawprints.findMany({
			where: {
				publishedOn: { isNotNull: true },
				...(input.tags?.length ? { tags: { arrayOverlaps: input.tags } } : {}),
				...(input.before || input.after
					? {
							createdOn: {
								...(input.before ? { lt: input.before } : {}),
								...(input.after ? { gt: input.after } : {}),
							},
						}
					: {}),
				OR: [
					input.search
						? {
								title: { like: `%${input.search}%` },
							}
						: {},
					input.search
						? {
								description: { like: `%${input.search}%` },
							}
						: {},
				],
				...(input.flags?.includes("EXPIRED")
					? {
							expiresOn: { lt: new Date() },
						}
					: {}),
			},
			with: {
				author: {
					columns: {
						name: true,
					},
				},
			},

			extras: {
				signatures: (table) =>
					db.$count(signatures, eq(table.id, signatures.pawprintId)),
				responses: (table) =>
					db.$count(responses, eq(table.id, responses.pawprintId)),
			},
			orderBy: (t) =>
				sql.raw(`${input.orderBy.field} ${input.orderBy.direction}, id desc`),
			offset: input.page * PAGE_SIZE,
			limit: PAGE_SIZE + 1,
		});

		// console.log(query.toSQL());

		const pawprints = await query;

		return {
			pawprints: pawprints.slice(0, PAGE_SIZE),
			nextPage: pawprints.length > PAGE_SIZE ? input.page + 1 : undefined,
		};
	});

export const getPawprint = sessionOptional
	.input(
		type({
			id: "string",
		}),
	)
	.handler(async ({ input: { id }, context: { session }, errors }) => {
		const userEmail = session?.user?.email || "";

		const pawprint = await db.query.pawprints.findFirst({
			where: {
				id,
			},
			with: {
				author: {
					columns: {
						name: true,
						avatar: true,
					},
				},
				responses: {
					columns: {
						createdOn: true,
						updatedOn: true,
						content: true,
						id: true,
					},
					orderBy: {
						createdOn: "desc",
					},
					with: {
						author: {
							columns: {
								name: true,
								avatar: true,
							},
						},
					},
				},
			},
			extras: {
				signs: (table) =>
					db.$count(signatures, and(eq(table.id, signatures.pawprintId))),
			},
		});

		if (!pawprint) throw errors.DOES_NOT_EXIST();

		return pawprint;
	});

export const getPawprintSignStatus = sessionOptional
	.input(type({ id: "string" }))
	.handler(async ({ input: { id }, context: { session }, errors }) => {
		const userId = session?.user?.id;
		if (!userId) return null;

		const sign = await db.query.signatures.findFirst({
			where: {
				pawprintId: id,
				userId,
			},
		});

		return sign || null;
	});

export const signPawprint = sessionRequired
	.input(
		type({
			id: "string",
			creationId: "string",
		}),
	)
	.handler(
		async ({ input: { id, creationId }, context: { session }, errors }) => {
			const userId = session.user.id;

			const pawprint = await db.query.pawprints.findFirst({
				where: { id },
				columns: {
					expiresOn: true,
					completedOn: true,
				},
			});

			if (!pawprint) throw errors.DOES_NOT_EXIST();
			if (
				pawprint.completedOn ||
				(pawprint.expiresOn && pawprint.expiresOn < new Date())
			)
				throw errors.SIGNING_EXPIRED();

			const signature = (
				await db
					.insert(signatures)
					.values({
						pawprintId: id,
						userId,
					})
					.onConflictDoNothing()
					.returning()
			)[0];

			await sendAblyEvent("signatures", "create", {
				id,
				creationId,
			});

			return signature;
		},
	);

export const getMyPawprints = ritRequired.handler(
	async ({
		context: {
			session: {
				user: { id: userId },
			},
		},
	}) => {
		return db.query.pawprints.findMany({
			where: {
				userId,
			},
			extras: {
				signatures: (table) =>
					db.$count(
						signatures,
						and(
							eq(table.id, signatures.pawprintId),
							eq(signatures.userId, userId),
						),
					),
				responses: (table) =>
					db.$count(responses, eq(table.id, responses.pawprintId)),
			},
		});
	},
);

export const getDrafts = ritRequired.handler(
	async ({
		context: {
			session: {
				user: { id: userId },
			},
		},
	}) => {
		return db.query.pawprints.findMany({
			where: {
				userId,
				publishedOn: { isNull: true },
			},
		});
	},
);

export const saveDraftPawprint = ritRequired
	.input(
		type({
			title: "string",
			description: "string",
			tags: "string[]",
			"id?": "string",
		}),
	)
	.handler(
		async ({
			input,
			context: {
				user: { id: userId },
			},
		}) => {
			if (!input.id) input.id = createId();
			return (
				await db
					.insert(pawprints)
					.values({
						...input,
						userId,
					})
					.onConflictDoUpdate({
						target: pawprints.id,
						set: input,
					})
					.returning()
			)[0];
		},
	);

export const editProfile = sessionRequired
	.input(
		type({
			"name?": "string",
			"avatar?": "string | null",
		}),
	)
	.handler(
		async ({
			context: {
				session: {
					user: { email, name },
				},
			},
			input,
		}) => {
			if (!input.name) input.name = name;
			await db.update(users).set(input).where(eq(users.email, email));
		},
	);

export const deleteDraftPawprint = ritRequired
	.input(
		type({
			id: "string",
		}),
	)
	.handler(
		async ({
			input: { id },
			context: {
				session: {
					user: { id: userId },
				},
			},
			errors,
		}) => {
			await db
				.delete(pawprints)
				.where(
					and(
						eq(pawprints.id, id),
						eq(pawprints.userId, userId),
						isNull(pawprints.publishedOn),
					),
				);
		},
	);

export const publishPawprint = ritRequired.input(publishValidation).handler(
	async ({
		input,
		context: {
			session: {
				user: { id: userId },
			},
		},
	}) => {
		const pawprint = {
			...(
				await db
					.insert(pawprints)
					.values({
						...input,
						publishedOn: new Date(),
						userId: userId,
					})
					.onConflictDoUpdate({
						target: pawprints.id,
						set: {
							...input,
							publishedOn: new Date(),
							expiresOn: sql`NOW() + INTERVAL '3 months'`,
						},
					})
					.returning()
			)[0],
			signatures: 0,
		};

		await sendAblyEvent("pawprints", "publish", pawprint);

		return pawprint;
	},
);

export const publishResponse = adminRequired.input(respondValidation).handler(
	async ({
		input,
		context: {
			session: {
				user: { id: userId },
			},
		},
	}) => {
		const response = await db
			.insert(responses)
			.values({
				...input,
				userId,
			})
			.returning();

		return response[0];
	},
);
