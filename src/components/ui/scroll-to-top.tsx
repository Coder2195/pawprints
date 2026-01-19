"use client";

import { FC, useEffect } from "react";

const ScrollToTop: FC = () => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollTo({
        top: 0,
      });
    }, 450);
    return () => {
      clearTimeout(timeout);
    };
  });

  return <></>;
};

export default ScrollToTop;
