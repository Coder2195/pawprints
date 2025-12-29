import { FC } from "react";
import Link from "next/link";

import "@/lib/rpc/server";
import { getPawprints } from "@/lib/rpc/router";
import { getServerSession } from "@/lib/auth/server";
import Image from "next/image";

const Home: FC = async () => {
  const pawprintList = await getPawprints();

  const session = await getServerSession();

  return (
    <>
      <header className="relative ">
        <h1 className="text-white ">Pawprints</h1>
        <h2 className="text-pms-427c underline decoration-orange decoration-10">
          For the students, without the vibe coders.
        </h2>
        <Image
          src="/banners/global-village.jpg"
          alt="Global Village"
          fill
          className="object-cover -z-50"
        />
      </header>
      <main>
        {pawprintList.map((pawprint) => (
          <div key={pawprint.id}>
            <Link href={`/pawprint/${pawprint.id}`}>
              {pawprint.title} - {pawprint.author?.name} (id: {pawprint.id})
            </Link>
          </div>
        ))}

        {JSON.stringify(session)}
      </main>
    </>
  );
};

export default Home;
