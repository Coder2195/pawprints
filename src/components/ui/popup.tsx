"use client";

import { easeOut, motion } from "motion/react";
import { FC, PropsWithChildren, ReactNode } from "react";
import { BiX } from "react-icons/bi";

const OverlayPopup: FC<
  PropsWithChildren & {
    title: ReactNode;
    onClose: () => void;
  }
> = ({ title, children, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.5 } }}
      exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.5 } }}
      className="w-screen h-screen bg-pms-430c/20 backdrop-blur-xs z-50 fixed top-0 left-0"
      onClick={(e) => {
        if (e.target != e.currentTarget) return;
        onClose();
      }}
    >
      <motion.dialog
        open
        className="sm:w-3/4 h-3/4 w-[calc(100%-1rem)] m-2 fixed sm:left-1/8 top-1/8 bg-solid border rounded-xl p-2 flex flex-col justify-stretch"
        initial={{
          translateY: "20%",
          opacity: 0,
        }}
        animate={{
          translateY: "0%",
          opacity: 1,
          transition: {
            delay: 1,
            duration: 0.4,
            ease: easeOut,
          },
        }}
        exit={{
          translateY: "20%",
          opacity: 0,
          transition: {
            duration: 0.4,
          },
        }}
      >
        <div className="flex flex-row items-start w-full">
          <h3 className="whitespace-nowrap flex-1 overflow-auto p-2">
            {title}
          </h3>
          <button
            className=" rounded-full m-1 w-7 h-7 flex items-center justify-center"
            onClick={onClose}
          >
            <BiX size={28} className="w-full h-full" />
          </button>
        </div>

        {children}
      </motion.dialog>
    </motion.div>
  );
};

export default OverlayPopup;
