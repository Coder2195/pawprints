import { betterAuth } from "better-auth";
import { customSession } from "better-auth/plugins";
import { db } from "../db";
import { users } from "../db/schema";

export const auth = betterAuth({
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  hooks: {},
  plugins: [
    customSession(async ({ user, session }) => {
      user.email = user.email?.replace("@g.rit.edu", "@rit.edu");

      const dbUser =
        (await db.query.users.findFirst({
          where: { email: user.email! },
        })) ||
        (
          await db
            .insert(users)
            .values({
              email: user.email,
              name: user.name || "Anonymous User",
              avatar: user.image,
              accountType: user.email.endsWith("@rit.edu")
                ? "STUDENT"
                : "GUEST",
            })
            .returning()
        )[0];

      if (user.email == null) throw new Error("User email is required");

      return {
        user: {
          ...user,
          createdAt: dbUser.createdAt,
          emailVerified: true,
          accountType: dbUser.accountType,
          image: dbUser.avatar || user.image,
          id: user.email,
          name: dbUser.name || user.name,
          updatedAt: dbUser.updatedAt,
        },
        session,
      };
    }),
  ],
  session: {
    cookieCache: {
      version: "1", // Change the version to invalidate all sessions
    },
  },
});
