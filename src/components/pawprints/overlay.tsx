"use client";
import { authClient } from "@/lib/auth/client";
import { client } from "@/lib/rpc";
import { GetPawprintResult } from "@/lib/rpc";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { BiX } from "react-icons/bi";

const OverlayPawprint: FC<{ pawprint: NonNullable<GetPawprintResult> }> = ({
  pawprint,
}) => {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();

  const userEmail = data?.user?.email;

  return (
    <div
      className="w-screen h-screen bg-pms-430c/20 backdrop-blur-xs z-50 fixed top-0 left-0"
      onClick={(e) => {
        if (e.target != e.currentTarget) return;
        router.back();
      }}
    >
      <dialog
        open
        className="w-3/4 h-3/4 fixed left-1/8 top-1/8 bg-solid border rounded-xl p-2"
      >
        <div className="flex flex-row items-start w-full">
          <h3 className="whitespace-nowrap flex-1 overflow-auto p-2">
            {pawprint.title}
          </h3>
          <button className=" rounded-full m-1 w-7 h-7 flex items-center justify-center">
            <BiX
              size={28}
              className="w-full h-full"
              onClick={() => router.back()}
            />
          </button>
        </div>

        {userEmail && (
          <button
            onClick={async () => {
              console.log(await client.getPawprint({ id: pawprint.id }));
            }}
          >
            {pawprint.signs || 0 > 0 ? "Signed" : "Not Signed"}
          </button>
        )}
      </dialog>
    </div>
  );
};

export default OverlayPawprint;
