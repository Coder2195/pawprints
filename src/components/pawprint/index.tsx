"use client";
import { GetPawprintResult } from "@/lib/rpc";
import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import OverlayPopup from "../ui/popup";
import Dialogue from "./dialogue";
import SignButton from "./sign";

const OverlayPawprint: FC<{ pawprint: NonNullable<GetPawprintResult> }> = ({
  pawprint: initial,
}) => {
  const [pawprint, setPawprint] = useState(initial);

  const router = useRouter();

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
        {pawprint.responses.length > 0 && (
          <>
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
          </>
        )}
      </div>

      <div className="p-2 border-t">
        <SignButton pawprint={pawprint} setPawprint={setPawprint} />
      </div>
    </OverlayPopup>
  );
};

export default OverlayPawprint;
