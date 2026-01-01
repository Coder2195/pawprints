"use client";
import { authClient } from "@/lib/auth/client";
import { client } from "@/lib/rpc";
import { GetPawprintResult } from "@/lib/rpc";
import { FC, useState } from "react";
import { BiX } from "react-icons/bi";
import { easeOut, motion } from "motion/react";
import { BProgress } from "@bprogress/core";

const OverlayPawprint: FC<{ pawprint: NonNullable<GetPawprintResult> }> = ({
  pawprint: initial,
}) => {
  const [pawprint, setPawprint] = useState(initial);
  const [signing, setSigning] = useState(false);
  const { data, isPending } = authClient.useSession();

  const signedIn = !!data?.user?.email;
  const signed = pawprint.signs > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.4 } }}
      className="w-screen h-screen bg-pms-430c/20 backdrop-blur-xs z-50 fixed top-0 left-0"
      onClick={(e) => {
        if (e.target != e.currentTarget) return;
      }}
    >
      <motion.dialog
        open
        className="w-3/4 h-3/4 fixed left-1/8 top-1/8 bg-solid border rounded-xl p-2 flex flex-col justify-stretch"
        initial={{
          translateY: "30%",
          opacity: 0,
        }}
        animate={{
          translateY: "0%",
          opacity: 1,
          transition: {
            delay: 0.5,
            duration: 0.4,
            ease: easeOut,
          },
        }}
        exit={{
          translateY: "30%",
          opacity: 0,
          transition: {
            duration: 0.4,
          },
        }}
      >
        <div className="flex flex-row items-start w-full">
          <h3 className="whitespace-nowrap flex-1 overflow-auto p-2">
            {pawprint.title}
          </h3>
          <button
            className=" rounded-full m-1 w-7 h-7 flex items-center justify-center"
            onClick={() => {
              history.pushState({}, "", `/`);
            }}
          >
            <BiX size={28} className="w-full h-full" />
          </button>
        </div>

        <div className="flex-1 overflow-auto bg-pms-427c/10 p-2 border rounded-lg">
          {pawprint.description}
        </div>

        <div className="pt-2">
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
      </motion.dialog>
    </motion.div>
  );
};

export default OverlayPawprint;
