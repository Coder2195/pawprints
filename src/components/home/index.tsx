"use client";
import { BProgress } from "@bprogress/core";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useChannel } from "ably/react";
import { AnimatePresence } from "motion/react";
import { type FC, useEffect, useState } from "react";
import type { AblySignPawprint } from "@/lib/ably/types";
import { PAGE_SIZE } from "@/lib/constants";
import {
	type GetPawprintsInput,
	type GetPawprintsResultItem,
	orpc,
} from "@/lib/rpc";
import { queryClient } from "@/lib/utils";
import Banner from "./banner";
import PawprintCard from "./card";
import CreatePawprint from "./create";
import Filters from "./filters";

function insertByInput(
	pawprints: GetPawprintsResultItem[],
	input: GetPawprintsInput,
	newPawprint: GetPawprintsResultItem,
): boolean {
	const isDesc = input.orderBy.direction === "desc";
	const targetField =
		input.orderBy.field === "published_on" ? "publishedOn" : "signatures";
	for (let i = 0; i < pawprints.length; i++) {
		// pawprints always ordered by id alphabet when ambigous
		const pawprint = pawprints[i];

		if (
			(isDesc
				? // biome-ignore lint/style/noNonNullAssertion: all new pawprints have a publishing date
					newPawprint[targetField]! > pawprint[targetField]!
				: // biome-ignore lint/style/noNonNullAssertion: all new pawprints have a publishing date
					newPawprint[targetField]! < pawprint[targetField]!) ||
			(pawprint[targetField] === newPawprint[targetField] &&
				newPawprint.id < pawprint.id)
		) {
			pawprints.splice(i, 0, newPawprint);
			return true;
		}
	}

	return false;
}

const HomePage: FC = () => {
	const [input, setInput] = useState<GetPawprintsInput>({
		orderBy: { field: "published_on", direction: "desc" },
	});
	const infiniteOptions = orpc.getPawprints.infiniteOptions({
		getNextPageParam: (d) => {
			return d.nextPage;
		},
		input(page) {
			return {
				...input,
				page,
			};
		},
		queryKey: [input],
		initialData: undefined,
		placeholderData: (prev) => {
			return prev;
		},
		initialPageParam: 0,
	});
	const {
		data,
		isPlaceholderData,
		status,
		isFetching,
		fetchNextPage,
		isFetchingNextPage,
	} = useInfiniteQuery(infiniteOptions);

	useChannel("signatures", (message) => {
		const { id } = message.data as AblySignPawprint;
		console.log("Received signature update for pawprint", id);

		if (!data) return;

		const newData = {
			...data,
			pages: data.pages.map((page) => ({
				...page,
				pawprints: page.pawprints.map((pawprint) => ({
					...pawprint,
					signatures:
						pawprint.id === id ? pawprint.signatures + 1 : pawprint.signatures,
				})),
			})),
		};

		queryClient.setQueryData(infiniteOptions.queryKey, newData);
	});

	useEffect(() => {
		if (isFetchingNextPage) {
			BProgress.start();
		} else {
			BProgress.done();
		}
	}, [isFetchingNextPage]);

	const list = data?.pages.flatMap((p) => p.pawprints || []);

	useChannel("pawprints", (message) => {
		if (!data) return;
		const newPawprint = message.data as GetPawprintsResultItem;
		newPawprint.completedOn =
			newPawprint.completedOn && new Date(newPawprint.completedOn);
		newPawprint.createdOn = new Date(newPawprint.createdOn);
		newPawprint.expiresOn =
			newPawprint.expiresOn && new Date(newPawprint.expiresOn);
		newPawprint.publishedOn =
			newPawprint.publishedOn && new Date(newPawprint.publishedOn);

		const listCopy = [...data.pages.flatMap((p) => p.pawprints || [])];

		if (input.tags && !input.tags.some((tag) => newPawprint.tags.includes(tag)))
			return;

		const publishedOn = newPawprint.publishedOn || new Date();

		if (input.before && input.before < publishedOn) return;

		if (input.after && input.after > publishedOn) return;

		insertByInput(listCopy, input, newPawprint);

		const newData = {
			...data,
			pages: data.pages.map((page, i) => ({
				...page,
				pawprints: listCopy.slice(i * PAGE_SIZE, (i + 1) * PAGE_SIZE),
			})),
		};

		queryClient.setQueryData(infiniteOptions.queryKey, newData);
	});

	const hasNext = data?.pages[data.pages.length - 1]?.nextPage !== undefined;

	const loading = isFetching || isFetchingNextPage;

	return (
		<>
			<Banner />

			<main className="restrict-width">
				<Filters input={input} setInput={setInput} />
				<div className="min-h-96">
					{loading && !list ? (
						<b className="w-full h-96 flex justify-center items-center mb-12">
							Loading...
						</b>
					) : !list ? (
						<b className="h-96 w-full flex items-center justify-center">
							Data not available.
						</b>
					) : (
						<>
							<div className="grid lg:grid-cols-3 gap-4 p-4 w-full sm:grid-cols-2 grid-cols-1">
								<AnimatePresence>
									{list.map((pawprint) => (
										<PawprintCard key={pawprint.id} pawprint={pawprint} />
									))}
								</AnimatePresence>
							</div>
							<div className="flex flex-row justify-center p-2">
								{loading && list ? (
									<b>Loading...</b>
								) : hasNext ? (
									<button
										type="button"
										className="button button-primary"
										onClick={() => {
											fetchNextPage();
										}}
									>
										Load more pawprints
									</button>
								) : (
									<b>No more pawprints.</b>
								)}
							</div>
						</>
					)}
				</div>
				<CreatePawprint />
			</main>
		</>
	);
};

export default HomePage;
