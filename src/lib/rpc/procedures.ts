import { os } from "@orpc/server";
import { signatures } from "../db/schema";
import { and, eq } from "drizzle-orm";
import z from "zod";
import { getServerSession } from "../auth/session";
import { db } from "../db";

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
    PAWPRINT_ALREADY_SIGNED: {
      message: "You have already signed this pawprint.",
      status: 409,
    },
    DOES_NOT_EXIST: {
      message: "The requested pawprint does not exist.",
      status: 404,
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
  }
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
  }
);

export const getPawprints = pub.handler(async () => {
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

export const getPawprint = sessionOptional
  .input(
    z.object({
      id: z.string(),
    })
  )
  .handler(async ({ input: { id }, context: { session }, errors }) => {
    const userEmail = session?.user?.email || "";

    const pawprint = await db.query.pawprints.findFirst({
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

    if (!pawprint) throw errors.DOES_NOT_EXIST();

    return pawprint;
  });

export const signPawprint = sessionRequired
  .input(
    z.object({
      id: z.string(),
    })
  )
  .handler(async ({ input: { id }, context: { session }, errors }) => {
    const userEmail = session.user.email;

    await db
      .insert(signatures)
      .values({
        pawprintId: id,
        userEmail,
      })
      .onConflictDoNothing();
  });
