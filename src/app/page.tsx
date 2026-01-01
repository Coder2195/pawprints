import { FC } from "react";

import "@/lib/rpc/server";
import { getServerSession } from "@/lib/auth/session";
import { headers } from "next/headers";

const Home: FC = async () => {
  const session = await getServerSession(await headers());

  return <></>;
};

export default Home;
