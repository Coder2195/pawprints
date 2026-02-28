import { APIError, betterAuth } from "better-auth";
import { customSession } from "better-auth/plugins";
import { db } from "../db";
import { users } from "../db/schema";

export const auth = betterAuth({
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID || "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
		},
	},
	baseURL: process.env.NEXT_PUBLIC_BASE_URL,
	onAPIError: {
		throw: true,
		errorURL: "/api/auth/error",
	},
	plugins: [
		customSession(async ({ user, session }) => {
			if (user.email === null)
				throw new APIError("UNAUTHORIZED", {
					message: "User email is required",
				});

			user.email = user.email.replace("@g.rit.edu", "@rit.edu");

			const dbUser =
				(await db.query.users.findFirst({
					where: { email: user.email },
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

			return {
				user: {
					...user,
					createdOn: dbUser.createdOn,
					emailVerified: true,
					accountType: dbUser.accountType,
					image: dbUser.avatar || user.image,
					id: user.email,
					name: dbUser.name || user.name,
					updatedOn: dbUser.updatedOn,
				},
				session,
			};
		}),
	],
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		cookieCache: {
			enabled: true,
			maxAge: 30 * 24 * 60 * 60, // 30 days
			strategy: "jwt", // or "compact" or "jwe"
			refreshCache: true, // enables fully stateless mode
		},
	},
	account: {
		storeStateStrategy: "cookie",
		storeAccountCookie: true, // Store account data after OAuth flow in a cookie (useful for database-less flows)
	},
});
