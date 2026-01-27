"use client";
import { BProgress } from "@bprogress/core";
import { useMutation } from "@tanstack/react-query";
import type { FC } from "react";
import { authClient, signIn } from "@/lib/auth/client";
import { type GetPawprintResult, orpc } from "@/lib/rpc";
import { useToasts } from "../providers/toast";

const SignButton: FC<{
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

	const signing = mutation.isPending;

	const signedIn = !!data?.user?.email;
	const signed = pawprint.signs > 0;

	const expired = Boolean(
		pawprint.expiresOn && pawprint.expiresOn < new Date(),
	);

	const disabled =
		signedIn && (signed || signing || pawprint.completed || expired);

	return (
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
					: expired
						? "Pawprint Expired"
						: pawprint.completed
							? "Pawprint Completed"
							: signing
								? "Signing..."
								: signed
									? "Signed"
									: "Not Signed"}
		</button>
	);
};

export default SignButton;
