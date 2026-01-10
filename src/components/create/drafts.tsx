"use client";

import { orpc } from "@/lib/rpc";
import { FC } from "react";
import { useQuery } from "@tanstack/react-query";

const Drafts: FC = () => {
  const query = useQuery(orpc.getDrafts.queryOptions());

  return <></>;
};

export default Drafts;
