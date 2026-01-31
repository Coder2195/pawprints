import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

type Router = typeof import("./server").router;

declare global {
	var $client: RouterClient<Router> | undefined;
}

const link = new RPCLink({
	url: `${
		typeof window !== "undefined"
			? window.location.origin
			: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
	}/api/rpc`,
});

/**
 * Fallback to client-side client if server-side client is not available.
 */

export const client: RouterClient<Router> =
	globalThis.$client ?? createORPCClient(link);

export const orpc = createTanstackQueryUtils(client);

// biome-ignore lint/suspicious/noExplicitAny: typescript uses any so i'm going to use any
type Result<T extends (...args: any[]) => Promise<any>> = Awaited<ReturnType<T>>;

export type GetPawprintResult = Result<typeof client.getPawprint>;

export type GetPawprintsResult = Result<typeof client.getPawprints>;
export type GetPawprintsInput = Parameters<typeof client.getPawprints>[0];

export type GetPawprintsResultItem = GetPawprintsResult["pawprints"][number];

export type GetDraftsResults = Result<typeof client.getDrafts>;
export type GetDraftsResultItem = GetDraftsResults[number];

export type GetMyPawprintsResult = Result<typeof client.getMyPawprints>;
