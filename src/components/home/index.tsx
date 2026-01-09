import { GetPawprintsResult } from "@/lib/rpc";
import { FC } from "react";
import Banner from "./banner";
import PawprintCard from "./card";

const HomePage: FC<{ pawprintList: GetPawprintsResult }> = ({
  pawprintList,
}) => {
  return (
    <>
      <Banner />
      <main className="restrict-width">
        <div className="grid lg:grid-cols-3 gap-4 p-4 w-full sm:grid-cols-2 grid-cols-1">
          {pawprintList.map((pawprint) => (
            <PawprintCard key={pawprint.id} pawprint={pawprint} />
          ))}
        </div>
      </main>
    </>
  );
};

export default HomePage;
