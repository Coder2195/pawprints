import "server-only";

import { createRouterClient, onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { headers } from "next/headers";
import {
	editProfile,
	getDrafts,
	getMyPawprints,
	getPawprint,
	getPawprints,
	saveDraftPawprint,
	signPawprint,
} from "./procedures";

export const router = {
	getPawprints,
	getPawprint,
	signPawprint,
	getDrafts,
	getMyPawprints,
	editProfile,
	saveDraftPawprint,
};

export const handler = new RPCHandler(router, {
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});

globalThis.$client = createRouterClient(router, {
	/**
	 * Provide initial context if needed.
	 *
	 * Because this client instance is shared across all requests,
	 * only include context that's safe to reuse globally.
	 * For per-request context, use middleware context or pass a function as the initial context.
	 */
	context: async () => ({
		headers: await headers(), // provide headers if initial context required
	}),
});
