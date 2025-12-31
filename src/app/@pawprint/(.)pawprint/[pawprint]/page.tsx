import OverlayPawprint from "@/components/pawprints/overlay";
import { client } from "@/lib/rpc";
import { FC } from "react";

const Pawprint: FC<{ params: Promise<{ pawprint: string }> }> = async ({
  params,
}) => {
  const { pawprint: id } = await params;
  const pawprint = await client.getPawprint({ id });

  if (!pawprint) return null;

  return <OverlayPawprint pawprint={pawprint} />;
};

export default Pawprint;
