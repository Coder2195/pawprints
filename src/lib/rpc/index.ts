import type { RouterClient } from "@orpc/server";
import { RPCLink } from "@orpc/client/fetch";
import { createORPCClient } from "@orpc/client";

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

export type GetPawprintResult = Awaited<ReturnType<typeof client.getPawprint>>;

export type GetPawprintsResult = Awaited<
  ReturnType<typeof client.getPawprints>
>;
export type GetPawprintsResultItem = GetPawprintsResult[number];
