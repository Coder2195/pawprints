import "@/lib/arktype";

import { os } from "@orpc/server";
import { createId } from "@paralleldrive/cuid2";
import { type } from "arktype";
import { and, eq, isNull } from "drizzle-orm";
import { getServerSession } from "../auth/session";
import { FETCH_SIZE } from "../constants";
import { db } from "../db";
import { pawprints, responses, signatures, users } from "../db/schema";
import { publishValidation } from "../utils";

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

export const getPawprints = pub
	.input(
		type({
			"tags?": "string[]",
			"before?": "Date",
			"after?": "Date",
			"search?": "string",
			"flags?": "string[]",
			"page?": "number",
		}),
	)
	.handler(async ({ input }) => {
		if (!input.page) input.page = 0;

		const pawprints = await db.query.pawprints.findMany({
			offset: input.page * FETCH_SIZE,
			limit: FETCH_SIZE + 1,
			where: {
				publishedOn: { isNotNull: true },
				...(input.tags?.length ? { tags: { arrayOverlaps: input.tags } } : {}),
				...(input.before || input.after
					? {
							createdAt: {
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
		});

		return {
			pawprints: pawprints.slice(0, FETCH_SIZE),
			nextPage: pawprints.length > FETCH_SIZE ? input.page + 1 : undefined,
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
						createdAt: true,
						updatedAt: true,
						content: true,
						id: true,
					},
					orderBy: {
						createdAt: "desc",
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
					db.$count(
						signatures,
						and(
							eq(table.id, signatures.pawprintId),
							eq(signatures.userEmail, userEmail),
						),
					),
			},
		});

		if (!pawprint) throw errors.DOES_NOT_EXIST();

		return pawprint;
	});

export const signPawprint = sessionRequired
	.input(
		type({
			id: "string",
		}),
	)
	.handler(async ({ input: { id }, context: { session }, errors }) => {
		const userEmail = session.user.email;

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

		await db
			.insert(signatures)
			.values({
				pawprintId: id,
				userEmail,
			})
			.onConflictDoNothing();
	});

export const getMyPawprints = ritRequired.handler(
	async ({
		context: {
			session: {
				user: { email: userEmail },
			},
		},
	}) => {
		return db.query.pawprints.findMany({
			where: {
				userEmail,
			},
			extras: {
				signatures: (table) =>
					db.$count(
						signatures,
						and(
							eq(table.id, signatures.pawprintId),
							eq(signatures.userEmail, userEmail),
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
				user: { email: userEmail },
			},
		},
	}) => {
		return db.query.pawprints.findMany({
			where: {
				userEmail,
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
				user: { email: userEmail },
			},
		}) => {
			if (!input.id) input.id = createId();
			return (
				await db
					.insert(pawprints)
					.values({
						...input,
						userEmail,
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
					user: { email },
				},
			},
			errors,
		}) => {
			await db
				.delete(pawprints)
				.where(
					and(
						eq(pawprints.id, id),
						eq(pawprints.userEmail, email),
						isNull(pawprints.publishedOn),
					),
				);
		},
	);

export const publishPawprint = ritRequired
	.input(publishValidation)
	.handler(async ({ input, context: { session } }) => {
		const pawprint = await db
			.insert(pawprints)
			.values({
				...input,
				publishedOn: new Date(),
				userEmail: session.user.email,
			})
			.onConflictDoUpdate({
				target: pawprints.id,
				set: {
					...input,
					publishedOn: new Date(),
				},
			})
			.returning();
	});
