import OverlayPawprint from "@/components/pawprint";
import "@/lib/rpc/server";
import type { Metadata } from "next";
import type { FC } from "react";
import { client } from "@/lib/rpc";

export const dynamic = "force-dynamic";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ pawprint: string }>;
}): Promise<Metadata> {
	const { pawprint: id } = await params;

	const pawprint = await client.getPawprint({ id });
	return {
		title: `${pawprint.title}`,
		description:
			pawprint.description.length > 160
				? `${pawprint.description.slice(0, 157)}...`
				: pawprint.description,

		openGraph: {
			images: {
				url: pawprint.author?.avatar || "/logo.png",
				alt: `${pawprint.author?.name}'s avatar`,
			},
			title: `Sign the Pawprint: ${pawprint.title}`,
		},
	};
}

const Pawprint: FC<{ params: Promise<{ pawprint: string }> }> = async ({
	params,
}) => {
	const { pawprint: id } = await params;

	const pawprint = await client.getPawprint({ id });

	return <OverlayPawprint pawprint={pawprint} />;
};

export default Pawprint;
