"use client";
import { authClient } from "@/lib/auth/client";
import { client } from "@/lib/rpc";
import { GetPawprintResult } from "@/lib/rpc";
import { FC, useState } from "react";
import { BProgress } from "@bprogress/core";
import { useRouter } from "next/navigation";
import OverlayPopup from "../ui/popup";

const OverlayPawprint: FC<{ pawprint: NonNullable<GetPawprintResult> }> = ({
  pawprint: initial,
}) => {
  const [pawprint, setPawprint] = useState(initial);
  const [signing, setSigning] = useState(false);
  const router = useRouter();
  const { data, isPending } = authClient.useSession();

  const signedIn = !!data?.user?.email;
  const signed = pawprint.signs > 0;

  return (
    <OverlayPopup
      onClose={() => {
        router.push("/");
      }}
      title={pawprint.title}
      footer={
        <>
          <button
            disabled={signedIn && (signed || signing)}
            className={` ${
              signing || signed ? "bg-pms-430c" : "bg-orange"
            } text-white font-bold p-1 px-4 rounded-lg mr-4`}
            onClick={async () => {
              if (!signedIn) {
                authClient.signIn.social({
                  provider: "google",
                });
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

                  setSigning(false);
                })
                .finally(() => {
                  BProgress.done();
                });
            }}
          >
            {!signedIn
              ? "Login to sign pawprints"
              : signing
              ? "Signing..."
              : signed
              ? "Signed"
              : "Not Signed"}
          </button>
        </>
      }
    >
      {pawprint.description}
    </OverlayPopup>
  );
};

export default OverlayPawprint;
