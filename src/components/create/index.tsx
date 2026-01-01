"use client";
import { FC } from "react";
import { useRouter } from "next/navigation";
import OverlayPopup from "../ui/popup";

const CreatePawprint: FC = () => {
  const router = useRouter();
  return (
    <OverlayPopup
      onClose={() => router.push("/")}
      title="Create Pawprint"
      footer={<></>}
    >
      <div></div>
    </OverlayPopup>
  );
};

export default CreatePawprint;
