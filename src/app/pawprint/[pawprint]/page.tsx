import { FC } from "react";

const Pawprint: FC<{ params: Promise<{ pawprint: string }> }> = async ({
  params,
}) => {
  const { pawprint } = await params;
  return <div className="w-1/2 h-1/2 fixed z-30 bg-black/50">{pawprint}</div>;
};

export default Pawprint;
