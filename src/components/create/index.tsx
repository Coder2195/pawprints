"use client";
import { FC } from "react";
import { useRouter } from "next/navigation";
import OverlayPopup from "../ui/popup";

const CreatePawprintClient: FC = () => {
  const router = useRouter();
  return (
    <OverlayPopup onClose={() => router.push("/")} title="Create Pawprint">
      <div></div>
    </OverlayPopup>
  );
};

export default CreatePawprintClient;
