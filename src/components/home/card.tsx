"use client";
import { SIGNATURE_THRESHOLD } from "@/lib/constants";
import { GetPawprintsResultItem } from "@/lib/rpc/";
import Link from "next/link";
import { FC } from "react";
import { motion } from "motion/react";

const PawprintCard: FC<{ pawprint: GetPawprintsResultItem }> = ({
  pawprint,
}) => {
  const percent = (pawprint.signatures / SIGNATURE_THRESHOLD) * 100;

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1, transition: { delay: 0.4 } }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
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
        <h4 className="text-base">
          {pawprint.author?.name || "Unknown Author"}
        </h4>
      </Link>
    </motion.div>
  );
};

export default PawprintCard;
