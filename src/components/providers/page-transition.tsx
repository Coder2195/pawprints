"use client";

import { FC, PropsWithChildren, useRef } from "react";
import { TransitionRouter } from "next-transition-router";
import { animate } from "framer-motion/dom";

const Transition: FC<PropsWithChildren> = ({ children }) => {
  const wrapperRef = useRef<HTMLDivElement>(null!);

  return (
    <TransitionRouter
      auto
      leave={(next) => {
        animate(
          wrapperRef.current,
          { opacity: [1, 0] },
          { duration: 0.5, onComplete: next }
        );
      }}
      enter={(next) => {
        animate(
          wrapperRef.current,
          { opacity: [0, 1] },
          { duration: 0.5, onComplete: next }
        );
      }}
    >
      <div ref={wrapperRef}>{children}</div>
    </TransitionRouter>
  );
};

export default Transition;
