import OverlayPawprint from "@/components/pawprint";
import "@/lib/rpc/server";
import { isDefinedError } from "@orpc/client";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
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
		metadataBase: new URL(
			process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
		),
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

	const pawprint = await client.getPawprint({ id }).catch((e) => {
		if (isDefinedError(e)) {
			redirect("/");
			return null;
		}
	});

	if (!pawprint) return;

	return <OverlayPawprint pawprint={pawprint} />;
};

export default Pawprint;
