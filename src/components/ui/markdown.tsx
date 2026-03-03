"use client";
import Link from "next/link";
import OldMarkdown from "react-markdown";

const Markdown: typeof OldMarkdown = ({ children }) => {
	return (
		<OldMarkdown
			components={{
				a: ({ node, ...props }) => (
					<Link
						href={props.href || ""}
						className="text-orange hover-underline"
						target="_blank"
					>
						{props.children}
					</Link>
				),
			}}
		>
			{children}
		</OldMarkdown>
	);
};

export default Markdown;
