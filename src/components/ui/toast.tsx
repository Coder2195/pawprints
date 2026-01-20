"use client";

import { FC, useEffect, useState } from "react";
import { ToastData } from "../providers/toast";
import { motion } from "motion/react";
import { BiX } from "react-icons/bi";

const Toast: FC<{
  toast: ToastData;
  remove: () => void;
  id: string;
}> = ({ toast: { title, body, liveTime, type }, remove, id }) => {
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (hover) return;
    const timeout = setTimeout(remove, liveTime);

    return () => clearTimeout(timeout);
  }, [hover, liveTime, remove]);

  const colorClassName =
    type == "information" || type == "success"
      ? "bg-orange"
      : type == "warning"
        ? "bg-yellow"
        : "bg-red";

  return (
    <motion.div layout>
      <motion.div
        initial={{
          x: "110%",
        }}
        animate={{
          x: "0%",
        }}
        exit={{
          x: "110%",
        }}
        className="w-72 bg-solid rounded-md border pointer-events-auto overflow-hidden relative"
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
      >
        <button onClick={remove} className="w-6 h-6 absolute top-0 right-0">
          <BiX className="w-full h-full" />
        </button>
        <div className="flex flex-col items-stretch gap-0.5 p-2">
          <div className="font-bold">{title}</div>
          <div className="text-sm">{body}</div>
        </div>
        <div className="bg-pms-430c/50 h-1">
          <div
            className={colorClassName + " h-full"}
            style={
              hover
                ? {
                    width: "100%",
                    animation: "none",
                  }
                : {
                    animation: `${liveTime}ms linear countdown`,
                    animationFillMode: "forwards",
                  }
            }
          ></div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Toast;
