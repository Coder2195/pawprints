"use client";
import { BProgress } from "@bprogress/core";
import { createId } from "@paralleldrive/cuid2";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useChannel } from "ably/react";
import { type FC, useState } from "react";
import { BiCheckCircle } from "react-icons/bi";
import { FaCalendarTimes } from "react-icons/fa";
import { MdFlag } from "react-icons/md";
import type { AblySignPawprint } from "@/lib/ably/types";
import { authClient, signIn } from "@/lib/auth/client";
import { SIGNATURE_THRESHOLD } from "@/lib/constants";
import { type GetPawprintResult, orpc } from "@/lib/rpc";
import { dateHourMinute, queryClient } from "@/lib/utils";
import { useToasts } from "../providers/toast";

const SignSection: FC<{
	pawprint: GetPawprintResult;
	setPawprint: (pawprint: GetPawprintResult) => void;
}> = ({ pawprint, setPawprint }) => {
	const { data, isPending: sessionPending } = authClient.useSession();
	const { addToast } = useToasts();

	const [creationId, setCreationId] = useState<string>(createId);

	const signStatusOptions = orpc.getPawprintSignStatus.queryOptions({
		input: { id: pawprint.id },
		initialData: null,
	});

	const { data: signData, isPending: signPending } =
		useQuery(signStatusOptions);

	const isPending = sessionPending || signPending;

	const mutation = useMutation(
		orpc.signPawprint.mutationOptions({
			onMutate: () => {
				BProgress.start();
			},
			onSettled: () => {
				BProgress.done();
			},
			onError: (error) => {
				addToast({
					type: "error",
					title: `Error Signing Pawprint: ${error.name}`,
					body: error.message || "We did not know what went wrong.",
					liveTime: 6000,
				});
			},
			onSuccess: (e) => {
				setPawprint({
					...pawprint,
					signs: pawprint.signs + 1,
				});

				addToast({
					type: "success",
					title: "Pawprint Signed",
					body: "You have successfully signed the pawprint.",
					liveTime: 4000,
				});

				queryClient.setQueryData(
					orpc.getPawprintSignStatus.queryKey({
						input: { id: pawprint.id },
					}),
					e,
				);
			},
		}),
	);

	useChannel("signatures", (message) => {
		const { id, creationId: messageCreationId } =
			message.data as AblySignPawprint;

		if (id === pawprint.id && messageCreationId !== creationId) {
			setPawprint({
				...pawprint,
				signs: pawprint.signs + 1,
			});
		}
	});

	if (pawprint.completedOn)
		return (
			<div className="bg-green rounded-lg border-lime border p-2 m-2 dark:text-black font-bold flex gap-4 items-center">
				<BiCheckCircle className="inline w-6" size={48} />
				<div className="flex-1">
					This pawprint has been marked as complete on{" "}
					{dateHourMinute(pawprint.completedOn)}.
				</div>
			</div>
		);

	if (pawprint.expiresOn && pawprint.expiresOn < new Date())
		return (
			<div className="bg-red rounded-lg fon border-b-orange border p-2 m-2 text-white font-bold flex gap-4 items-center">
				<FaCalendarTimes className="inline w-6" size={48} />
				<div className="flex-1">
					This pawprint has expired on {dateHourMinute(pawprint.expiresOn)}.
				</div>
			</div>
		);

	const signing = mutation.isPending;

	const signedIn = !!data?.user?.email;

	const disabled = Boolean(signedIn && (signData || signing));

	return (
		<div className="p-2 border-t flex w-full justify-between items-center flex-wrap gap-2">
			<button
				disabled={disabled}
				className="button button-primary text-lg font-bold"
				type="button"
				onClick={async () => {
					if (!signedIn) {
						signIn();
						return;
					}

					if (disabled) return;
					mutation.mutate(
						{ id: pawprint.id, creationId },
						{
							onSuccess: () => {
								setPawprint({
									...pawprint,
									signs: pawprint.signs + 1,
								});
							},
						},
					);
				}}
			>
				{isPending
					? "Loading..."
					: !signedIn
						? "Login to sign pawprints"
						: signing
							? "Signing..."
							: signData
								? "Signed"
								: "Sign"}
			</button>
			<span className="font-bold text-orange">
				{pawprint.signs > 0
					? ` ${pawprint.signs}/${SIGNATURE_THRESHOLD} signatures`
					: "No Signatures yet"}
			</span>
			<button
				className="button button-red font-bold flex gap-1 items-center"
				type="button"
			>
				<MdFlag size={48} className="w-7 h-7" aria-label="Flag Icon" /> Report
			</button>
		</div>
	);
};

export default SignSection;
