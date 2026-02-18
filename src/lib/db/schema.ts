import { createId } from "@paralleldrive/cuid2";
import { defineRelations, sql } from "drizzle-orm";
import {
	boolean,
	cockroachEnum,
	cockroachTable,
	primaryKey,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/cockroach-core";

export const accountTypes = cockroachEnum("account_type", [
	"GUEST",
	"STUDENT",
	"PROFESSOR",
	"ADMIN",
]);

export type AccountType = (typeof accountTypes.enumValues)[number];

export const users = cockroachTable("users", {
	email: varchar("email", { length: 254 }).primaryKey(),
	name: varchar("name", { length: 256 }).notNull(),
	accountType: accountTypes("account_type").notNull().default("GUEST"),
	avatar: varchar("avatar", { length: 256 }),

	createdAt: timestamp("created_at", { withTimezone: true }),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

const defaultId = () => createId();

export const pawprints = cockroachTable("pawprints", {
	id: varchar("id", { length: 25 }).primaryKey().$defaultFn(defaultId),

	userEmail: varchar("user_email", { length: 254 })
		.notNull()
		.references(() => users.email),
	title: varchar("title", { length: 256 }).notNull(),
	description: varchar("description", { length: 10000 }).notNull(),
	tags: text("tags").array().notNull().default(sql`ARRAY[]::TEXT[]`),
	completed: boolean("completed").notNull().default(false),
	publishedAt: timestamp("published_at", { withTimezone: true }),
	expiresOn: timestamp("expires_on", { withTimezone: true }).default(
		sql`NOW() + INTERVAL '7 days'`,
	),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull()
		.$onUpdate(() => sql`NOW()`),
});

export const signatures = cockroachTable(
	"signatures",
	{
		userEmail: varchar("user_email", { length: 254 })
			.notNull()
			.references(() => users.email, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		pawprintId: varchar("pawprint_id", { length: 25 })
			.notNull()
			.references(() => pawprints.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
	},
	(table) => [primaryKey({ columns: [table.userEmail, table.pawprintId] })],
);

export const responses = cockroachTable("responses", {
	id: varchar("id", { length: 25 }).primaryKey().$defaultFn(defaultId),

	userEmail: varchar("user_email", { length: 254 })
		.notNull()
		.references(() => users.email, {
			onDelete: "cascade",
			onUpdate: "cascade",
		}),
	content: varchar("description", { length: 5000 }).notNull(),
	pawprintId: varchar("pawprint_id", { length: 25 })
		.notNull()
		.references(() => pawprints.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		}),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.$onUpdate(() => sql`CURRENT_TIMESTAMP`)
		.notNull(),
});

export const relations = defineRelations(
	{ pawprints, users, signatures, responses },
	(r) => ({
		users: {
			pawprints: r.many.pawprints({
				from: r.users.email,
				to: r.pawprints.userEmail,
			}),
			signatures: r.many.signatures({
				from: r.users.email,
				to: r.signatures.userEmail,
			}),
			responses: r.many.responses({
				from: r.users.email,
				to: r.responses.userEmail,
			}),
		},
		pawprints: {
			signatures: r.many.signatures({
				from: r.pawprints.id,
				to: r.signatures.pawprintId,
			}),
			author: r.one.users({
				from: r.pawprints.userEmail,
				to: r.users.email,
			}),
			responses: r.many.responses({
				from: r.pawprints.id,
				to: r.responses.pawprintId,
			}),
		},
		signatures: {
			pawprint: r.one.pawprints({
				from: r.signatures.pawprintId,
				to: r.pawprints.id,
			}),
			signer: r.one.users({
				from: r.signatures.userEmail,
				to: r.users.email,
			}),
		},
		responses: {
			pawprint: r.one.pawprints({
				from: r.responses.pawprintId,
				to: r.pawprints.id,
			}),
			author: r.one.users({
				from: r.responses.userEmail,
				to: r.users.email,
			}),
		},
	}),
);
