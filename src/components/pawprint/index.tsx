"use client";
import { authClient } from "@/lib/auth/client";
import { client } from "@/lib/rpc";
import { GetPawprintResult } from "@/lib/rpc";
import { FC, useState } from "react";
import { BProgress } from "@bprogress/core";
import { useRouter } from "next/navigation";
import OverlayPopup from "../ui/popup";
import Dialogue from "./dialogue";

const OverlayPawprint: FC<{ pawprint: NonNullable<GetPawprintResult> }> = ({
  pawprint: initial,
}) => {
  const [pawprint, setPawprint] = useState(initial);
  const [signing, setSigning] = useState(false);
  const router = useRouter();
  const { data } = authClient.useSession();

  const signedIn = !!data?.user?.email;
  const signed = pawprint.signs > 0;

  return (
    <OverlayPopup
      onClose={() => {
        router.push("/");
      }}
      title={pawprint.title}
    >
      <div className="flex-1 flex flex-col gap-2 p-2 overflow-auto">
        <Dialogue
          name={pawprint.author?.name}
          avatar={pawprint.author?.avatar || undefined}
          createdAt={pawprint.createdAt!}
          updatedAt={pawprint.updatedAt!}
        >
          <p>{pawprint.description}</p>
        </Dialogue>
        <hr className="-mx-2" />
        <h5 className="sm:ml-14">Updates</h5>
        {pawprint.responses.map((response, index) => (
          <Dialogue
            name={response.author?.name}
            ping={index == 0}
            avatar={response.author?.avatar || undefined}
            key={response.id}
            createdAt={response.createdAt!}
            updatedAt={response.updatedAt!}
          >
            <p>{response.content}</p>
          </Dialogue>
        ))}
      </div>

      <div className="p-2 border-t">
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
      </div>
    </OverlayPopup>
  );
};

export default OverlayPawprint;
