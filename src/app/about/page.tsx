import type { Metadata } from "next";
import Link from "next/link";
import type { FC, ReactNode } from "react";
import Banner from "@/components/about/banner";
import TransitionWrapper from "@/components/transition/wrapper";

export const metadata: Metadata = {
	title: "About Pawprints",
	description: "The philosophy and motivation behind Pawprints.",
};

const FAQ: { q: ReactNode; a: ReactNode; id: string }[] = [
	{
		q: "What is this website?",
		a: "This is a website where people are free to express their concerns and ideas for the school through petitions.",
		id: "what-is-this-website",
	},
	{
		q: "What is wrong with the original Pawprints 2?",
		a: (
			<>
				On{" "}
				<Link
					href="https://pawprints.rit.edu"
					target="_blank"
					className="hover-underline text-orange"
				>
					Pawprints 2
				</Link>
				, the website is designed according to the philosophy of about 10 years
				ago, and despite their newest upgrade, while the website uses modern
				tools like NextJS, uses a SAML login flow and just some legacy code.
				This website aims to use OAuth2, drizzle, and NextJS app router to
				create a modern, well desiged, and most of all, accessible and user
				friendly website.
			</>
		),
		id: "what-is-wrong-with-original-pawprints",
	},
] as const;

const About: FC = () => {
	return (
		<TransitionWrapper>
			<Banner />

			<div className="restrict-width py-4">
				{FAQ.map(({ q, a, id }) => (
					<div key={id} id={id} className="my-4">
						<h2 className="text-3xl font-bold mb-2">{q}</h2>
						<p className="text-lg mb-4">{a}</p>
					</div>
				))}
			</div>
		</TransitionWrapper>
	);
};

export default About;
