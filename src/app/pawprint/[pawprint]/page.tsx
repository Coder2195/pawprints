import OverlayPawprint from "@/components/pawprint";
import "@/lib/rpc/server";
import type { FC } from "react";
import { client } from "@/lib/rpc";

export const dynamic = "force-dynamic";

const Pawprint: FC<{ params: Promise<{ pawprint: string }> }> = async ({
	params,
}) => {
	const { pawprint: id } = await params;

	const pawprint = await client.getPawprint({ id });

	return <OverlayPawprint pawprint={pawprint} />;
};

export default Pawprint;
