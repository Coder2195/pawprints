"use client";

import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";
import { authClient } from "@/lib/auth/client";
import { orpc } from "@/lib/rpc";
import PawprintCard from "../home/card";

const MyPawprints: FC = () => {
	const { data: session, isPending } = authClient.useSession();
	const { isLoading, data } = useQuery(orpc.getMyPawprints.queryOptions({}));

	return (
		<div className="border rounded-lg w-full md:flex-1 p-2 flex flex-col gap-2 min-h-32">
			<h3>My Pawprints</h3>
			{isLoading || isPending ? (
				<b>Loading...</b>
			) : session && data ? (
				data.map((p) => (
					<PawprintCard
						pawprint={{
							...p,
							author: session.user,
						}}
						key={p.id}
					/>
				))
			) : (
				<b>No pawprints found.</b>
			)}
		</div>
	);
};

export default MyPawprints;
