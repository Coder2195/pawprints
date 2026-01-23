"use client";
import { BProgress } from "@bprogress/core";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "motion/react";
import { type FC, useEffect, useState } from "react";
import { type GetPawprintsInput, orpc } from "@/lib/rpc";
import Banner from "./banner";
import PawprintCard from "./card";
import CreatePawprint from "./create";
import Filters from "./filters";

const HomePage: FC = () => {
	const [input, setInput] = useState<GetPawprintsInput>({});
	const { data, isPlaceholderData, status } = useQuery(
		orpc.getPawprints.queryOptions({
			input,
			queryKey: ["getPawprints", input],
			initialData: undefined,
			placeholderData: (prev) => {
				return prev;
			},
		}),
	);

	useEffect(() => {
		if (isPlaceholderData || status === "pending") {
			BProgress.start();
		} else {
			BProgress.done();
		}
	}, [isPlaceholderData, status]);

	return (
		<>
			<Banner />

			<main className="restrict-width">
				<Filters input={input} setInput={setInput} />
				<div className="min-h-96">
					{status === "pending" || data === undefined ? (
						<b className="h-96 w-full flex items-center justify-center">
							Loading...
						</b>
					) : data?.length ? (
						<div className="grid lg:grid-cols-3 gap-4 p-4 w-full sm:grid-cols-2 grid-cols-1">
							<AnimatePresence>
								{data.map((pawprint) => (
									<PawprintCard key={pawprint.id} pawprint={pawprint} />
								))}
							</AnimatePresence>
						</div>
					) : (
						<b className="h-96 w-full flex items-center justify-center">
							No pawprints found.
						</b>
					)}
				</div>
				<CreatePawprint />
			</main>
		</>
	);
};

export default HomePage;
