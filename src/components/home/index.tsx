"use client";
import { GetPawprintsInput, orpc } from "@/lib/rpc";
import { FC, useState } from "react";
import Banner from "./banner";
import { useQuery } from "@tanstack/react-query";
import Filters from "./filters";
import PawprintCard from "./card";

const HomePage: FC = () => {
  const [input, setInput] = useState<GetPawprintsInput>({});
  const { data, status } = useQuery(
    orpc.getPawprints.queryOptions({
      input,
      queryKey: ["getPawprints", input],
    })
  );

  return (
    <>
      <Banner />

      <main className="restrict-width">
        <Filters input={input} setInput={setInput} />
        <div className="min-h-96">
          {status == "pending" ? (
            <b className="h-96 w-full flex items-center justify-center">
              Fetching pawprints...
            </b>
          ) : data ? (
            <div className="grid lg:grid-cols-3 gap-4 p-4 w-full sm:grid-cols-2 grid-cols-1">
              {data?.map((pawprint) => (
                <PawprintCard key={pawprint.id} pawprint={pawprint} />
              ))}
            </div>
          ) : (
            <b className="h-96 w-full flex items-center justify-center">
              No pawprints found.
            </b>
          )}
        </div>
      </main>
    </>
  );
};

export default HomePage;
