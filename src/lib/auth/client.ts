import { customSessionClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from ".";

export const authClient = createAuthClient({
	/** The base URL of the server (optional if you're using the same domain) */
	baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
	plugins: [customSessionClient<typeof auth>()],
});

export function signIn() {
	authClient.signIn.social({ provider: "google" });
}

export const signOut = authClient.signOut;
