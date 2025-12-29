import { createId } from "@paralleldrive/cuid2";
import { defineRelations, sql } from "drizzle-orm";
import {
  cockroachTable,
  timestamp,
  cockroachEnum,
  varchar,
} from "drizzle-orm/cockroach-core";

export const accountTypes = cockroachEnum("account_type", [
  "GUEST",
  "STUDENT",
  "PROFESSOR",
  "ADMIN",
]);

export const users = cockroachTable("users", {
  email: varchar("email", { length: 254 }).primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  accountType: accountTypes().notNull().default("GUEST"),
  avatar: varchar("avatar", { length: 256 }),

  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const pawprints = cockroachTable("pawprints", {
  id: varchar("id", { length: 25 })
    .primaryKey()
    .$defaultFn(() => createId()),

  userEmail: varchar("user_email", { length: 254 }).notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  description: varchar("description", { length: 5000 }).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
});

export const signatures = cockroachTable("signatures", {
  userEmail: varchar("user_email", { length: 254 }).notNull(),
  pawprintId: varchar("pawprint_id", { length: 25 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const relations = defineRelations(
  { pawprints, users, signatures },
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
  })
);
