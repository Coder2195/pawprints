"use client";

import { authClient, signIn } from "@/lib/auth/client";
import { FreeImageResponse } from "@/lib/types/freeimage";
import { BProgress } from "@bprogress/core";
import Image from "next/image";
import { FC, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { useToasts } from "../providers/toast";

const EditProfile: FC = () => {
  const { data, isPending, refetch, isRefetching } = authClient.useSession();
  const { addToast } = useToasts();
  const [image, setImage] = useState<string>();

  if (!data && !isPending) signIn();

  const resolvedImg = image || data?.user.image || "";

  return (
    <div className="border rounded-md w-full p-2 py-6 flex justify-center flex-row">
      {isPending ? (
        <b>Loading...</b>
      ) : (
        <>
          <button className="w-24 h-24 rounded-full overflow-hidden border-4 relative">
            <Image
              src={resolvedImg}
              width={100}
              height={100}
              alt="Avatar"
              className="w-full h-full"
            />
            <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center z-10 hover:opacity-100 opacity-0 bg-black/50 transition-opacity duration-300 ease-in-out ">
              <input
                type="file"
                className="opacity-0 w-full h-full z-10 absolute top-0 left-0 cursor-pointer"
                accept="image/*"
                onChange={async (e) => {
                  const elm = e.currentTarget;
                  const file = elm.files?.item(0);

                  if (!file) return;

                  elm.disabled = true;
                  BProgress.start();

                  const formData = new FormData();
                  formData.append("source", file);

                  const result = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                  }).then((res) => res.json() as Promise<FreeImageResponse>);

                  elm.disabled = false;
                  BProgress.done();

                  elm.value = "";
                }}
              />
              <FiUpload className="w-1/3 h-1/3" />
            </div>
          </button>
        </>
      )}
      <button
        onClick={() => {
          addToast({
            title: "dfdffddf",
            body: "sdffddf",
            liveTime: 5000,
            type: "success",
          });
        }}
      >
        spam
      </button>
    </div>
  );
};

export default EditProfile;
