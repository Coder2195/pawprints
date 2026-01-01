"use client";
import { client } from "@/lib/rpc";
import { useSearchParams } from "next/navigation";
import { FC, PropsWithChildren, useEffect } from "react";
import { usePawprintOverlay } from "../providers/pawprint-overlay";
import { BProgress } from "@bprogress/core";

const HomeClient: FC<PropsWithChildren> = ({ children }) => {
  const searchParams = useSearchParams();
  const { setPawprint } = usePawprintOverlay();
  const id = searchParams.get("pawprint");

  useEffect(() => {
    if (!id) {
      setPawprint(null);
      history.pushState({}, "", `/`);
      return;
    }

    BProgress.start();
    client
      .getPawprint({ id })
      .then((pawprint) => {
        setPawprint(pawprint);
      })
      .catch(() => {
        setPawprint(null);
        history.pushState({}, "", `/`);
      })
      .finally(() => {
        BProgress.done();
      });
  }, [id, setPawprint]);

  return <>{children}</>;
};

export default HomeClient;
