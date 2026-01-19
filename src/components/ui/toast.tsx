"use client";

import { FC, useEffect, useState } from "react";
import { ToastData } from "../providers/toast";
import { motion } from "motion/react";

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

  return (
    <motion.div layout>
      <motion.div
        initial={{
          x: "100%",
        }}
        animate={{
          x: "0%",
        }}
        exit={{
          x: "100%",
        }}
        className="w-36 bg-solid rounded-md border p-2 pointer-events-auto"
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
      >
        <div className="w-full h-2 rounded-full border">
          <div
            className="bg-orange rounded-full h-full"
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
        <div className="">{title}</div>
      </motion.div>
    </motion.div>
  );
};

export default Toast;
