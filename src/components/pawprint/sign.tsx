"use client";
import { BProgress } from "@bprogress/core";
import { useMutation } from "@tanstack/react-query";
import type { FC } from "react";
import { BiCheckCircle } from "react-icons/bi";
import { FaCalendarTimes } from "react-icons/fa";
import { authClient, signIn } from "@/lib/auth/client";
import { SIGNATURE_THRESHOLD } from "@/lib/constants";
import { type GetPawprintResult, orpc } from "@/lib/rpc";
import { dateHourMinute } from "@/lib/utils";
import { useToasts } from "../providers/toast";

const SignSection: FC<{
	pawprint: GetPawprintResult;
	setPawprint: (pawprint: GetPawprintResult) => void;
}> = ({ pawprint, setPawprint }) => {
	const { data, isPending } = authClient.useSession();
	const { addToast } = useToasts();

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
			onSuccess: () => {
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
			},
		}),
	);

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
	const signed = pawprint.signs > 0;

	const disabled = signedIn && (signed || signing);

	return (
		<div className="p-2 border-t flex w-full justify-between items-center">
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

					mutation.mutate({ id: pawprint.id });
				}}
			>
				{isPending
					? "Loading..."
					: !signedIn
						? "Login to sign pawprints"
						: signing
							? "Signing..."
							: signed
								? "Signed"
								: "Sign"}
			</button>
			<span className="font-bold text-orange">
				{pawprint.signs > 0
					? ` ${pawprint.signs}/${SIGNATURE_THRESHOLD} signatures`
					: "No Signatures yet"}
			</span>
		</div>
	);
};

export default SignSection;
