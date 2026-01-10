"use client";
import { SIGNATURE_THRESHOLD } from "@/lib/constants";
import { GetPawprintsResultItem } from "@/lib/rpc/";
import Link from "next/link";
import { FC } from "react";

const PawprintCard: FC<{ pawprint: GetPawprintsResultItem }> = ({
  pawprint,
}) => {
  const percent = (pawprint.signatures / SIGNATURE_THRESHOLD) * 100;

  return (
    <Link href={`/pawprint/${pawprint.id}`} className="card" prefetch={false}>
      <div className="w-full h-2 rounded-full border  bg-pms-429c/30 overflow-hidden">
        <div
          className="bg-orange h-full rounded-full"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
      <div className="text-xs mb-2">
        {pawprint.signatures}/{SIGNATURE_THRESHOLD} signatures
      </div>

      <h3 className="text-lg">{pawprint.title}</h3>
      <h4 className="text-base">{pawprint.author?.name || "Unknown Author"}</h4>
    </Link>
  );
};

export default PawprintCard;
