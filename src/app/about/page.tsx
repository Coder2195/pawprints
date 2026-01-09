import type { Metadata } from "next";

import Banner from "@/components/about/banner";
import { FC } from "react";
import TransitionWrapper from "@/components/transition/wrapper";

export const metadata: Metadata = {
  title: "About Pawprints",
  description: "The philosophy and motivation behind Pawprints.",
};

const About: FC = () => {
  return (
    <TransitionWrapper>
      <Banner />
    </TransitionWrapper>
  );
};

export default About;
