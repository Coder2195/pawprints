"use client";
import { authClient, login } from "@/lib/auth/client";
import { client, GetPawprintResult } from "@/lib/rpc";
import { BProgress } from "@bprogress/core";
import { FC, useState } from "react";

const SignButton: FC<{
  pawprint: GetPawprintResult;
  setPawprint: (pawprint: GetPawprintResult) => void;
}> = ({ pawprint, setPawprint }) => {
  const { data, isPending } = authClient.useSession();

  const [signing, setSigning] = useState(false);

  const signedIn = !!data?.user?.email;
  const signed = pawprint.signs > 0;

  return (
    <button
      disabled={signedIn && (signed || signing)}
      className="button button-primary"
      onClick={async () => {
        if (!signedIn) {
          login();
          return;
        }

        if (signed || signing) return;

        setSigning(true);
        BProgress.start();
        client
          .signPawprint({ id: pawprint.id })
          .then(() => {
            setPawprint({
              ...pawprint,
              signs: pawprint.signs + 1,
            });
          })
          .finally(() => {
            setSigning(false);
            BProgress.done();
          });
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
