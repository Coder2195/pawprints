import type { Metadata } from "next";
import type { FC } from "react";
import Banner from "@/components/about/banner";
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
