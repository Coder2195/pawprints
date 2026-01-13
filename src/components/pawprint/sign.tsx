"use client";
import { authClient, signIn } from "@/lib/auth/client";
import { GetPawprintResult, orpc } from "@/lib/rpc";
import { BProgress } from "@bprogress/core";
import { useMutation } from "@tanstack/react-query";
import { FC } from "react";

const SignButton: FC<{
  pawprint: GetPawprintResult;
  setPawprint: (pawprint: GetPawprintResult) => void;
}> = ({ pawprint, setPawprint }) => {
  const { data, isPending } = authClient.useSession();

  const mutation = useMutation(
    orpc.signPawprint.mutationOptions({
      onMutate: () => {
        BProgress.start();
      },
      onSettled: () => {
        BProgress.done();
      },
      onSuccess: () => {
        setPawprint({
          ...pawprint,
          signs: pawprint.signs + 1,
        });
      },
    })
  );

  const signing = mutation.isPending;

  const signedIn = !!data?.user?.email;
  const signed = pawprint.signs > 0;

  return (
    <button
      disabled={signedIn && (signed || signing)}
      className="button button-primary text-lg font-bold"
      onClick={async () => {
        if (!signedIn) {
          signIn();
          return;
        }

        if (signed || signing) return;

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
        : "Not Signed"}
    </button>
  );
};

export default SignButton;
