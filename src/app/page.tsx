import { FC } from "react";

import "@/lib/rpc/server";
import Banner from "@/components/home/banner";
import Pawprint from "@/components/home/pawprint";
import { getServerSession } from "@/lib/auth/session";
import { client } from "@/lib/rpc";
import { headers } from "next/headers";

const Home: FC = async () => {
  const pawprintList = await client.getPawprints();

  const session = await getServerSession(await headers());

  return (
    <>
      <Banner />
      <main className="restrict-width">
        <div className="grid lg:grid-cols-3 gap-4 p-4 w-full sm:grid-cols-2 grid-cols-1">
          {pawprintList.map((pawprint) => (
            <Pawprint key={pawprint.id} pawprint={pawprint} />
          ))}
        </div>
        {JSON.stringify(session)}
      </main>
    </>
  );
};

export default Home;
