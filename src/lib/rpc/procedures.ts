import { os } from "@orpc/server";
import { signatures } from "../db/schema";
import { and, eq } from "drizzle-orm";
import z from "zod";

const base = os
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
    PAWPRINT_ALREADY_SIGNED: {
      message: "You have already signed this pawprint.",
      status: 409,
    },
    DOES_NOT_EXIST: {
      message: "The requested pawprint does not exist.",
      status: 404,
    },
  })
  .$context<{ headers: Headers; db: typeof import("../db").db }>();

const fetchSession = base.middleware(
  async ({ context: { headers, db }, next }) => {
    if (typeof window !== "undefined") return next();
    const session = await import("../auth/session").then((mod) =>
      mod.getServerSession(headers)
    );

    return next({
      context: {
        session,
      },
    });
  }
);

export const getPawprints = base.handler(async ({ context: { db } }) => {
  return db.query.pawprints.findMany({
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
    },
  });
});

export const getPawprint = base

  .input(
    z.object({
      id: z.string(),
    })
  )
  .handler(async ({ input: { id }, context: { db } }) => {
    const userEmail = "";

    return db.query.pawprints.findFirst({
      where: {
        id,
      },
      extras: {
        signs: (table) =>
          db.$count(
            signatures,
            and(
              eq(table.id, signatures.pawprintId),
              eq(signatures.userEmail, userEmail)
            )
          ),
      },
    });
  });
