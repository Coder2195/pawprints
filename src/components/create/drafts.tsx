"use client";

import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";
import { orpc } from "@/lib/rpc";

const Drafts: FC = () => {
	const query = useQuery(orpc.getDrafts.queryOptions());

	return <></>;
};

export default Drafts;
