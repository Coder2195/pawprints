"use client";

import Banner from "@/components/about/banner";
import { motion } from "motion/react";
import { FC } from "react";

const About: FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.5, duration: 0.5 } }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <Banner />
      <Banner />
      <Banner />
      <Banner />
      <Banner />
    </motion.div>
  );
};

export default About;
