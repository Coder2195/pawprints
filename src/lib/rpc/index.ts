import type { RouterClient } from "@orpc/server";
import { RPCLink } from "@orpc/client/fetch";
import { createORPCClient } from "@orpc/client";
import { getPawprint, getPawprints } from "./procedures";

declare global {
  var $client: RouterClient<typeof router> | undefined;
}

const link = new RPCLink({
  url: `${
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000"
  }/api/rpc`,
});

export const router = {
  getPawprints,
  getPawprint,
};

/**
 * Fallback to client-side client if server-side client is not available.
 */

export const client: RouterClient<typeof router> =
  globalThis.$client ?? createORPCClient(link);

export type GetPawprintResult = Awaited<ReturnType<typeof client.getPawprint>>;

export type GetPawprintsResult = Awaited<
  ReturnType<typeof client.getPawprints>
>;
export type GetPawprintsResultItem = GetPawprintsResult[number];
