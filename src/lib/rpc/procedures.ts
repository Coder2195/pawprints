import { os } from "@orpc/server";
import { signatures } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "../auth/session";
import { db } from "../db";
import { type } from "arktype";

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

const ritRequired = sessionRequired.use(
  async ({
    context: {
      session: { user },
    },
    errors,
    next,
  }) => {
    if (user.accountType == "GUEST") throw errors.GUEST_NOT_ALLOWED();

    return next({
      context: {
        user,
      },
    });
  }
);

export const getPawprints = pub
  .input(
    type({
      "tags?": "string[]",
      "before?": "Date",
      "after?": "Date",
    })
  )
  .handler(async ({ input }) => {
    return db.query.pawprints.findMany({
      where: {
        published: true,
        ...(input.tags ? { tags: { arrayOverlaps: input.tags } } : {}),
        ...(input.before || input.after
          ? {
              createdAt: {
                ...(input.before ? { lt: input.before } : {}),
                ...(input.after ? { gt: input.after } : {}),
              },
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
      },
    });
  });

export const getPawprint = sessionOptional
  .input(
    type({
      id: "string",
    })
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
    type({
      id: "string",
    })
  )
  .handler(async ({ input: { id }, context: { session } }) => {
    const userEmail = session.user.email;

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
    });
  }
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
        published: false,
      },
    });
  }
);
