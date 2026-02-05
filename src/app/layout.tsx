import type { Metadata } from "next";
import "./main.css";
import { Google_Sans_Code } from "next/font/google";
import localFont from "next/font/local";
import type { FC, PropsWithChildren } from "react";
import Providers from "@/components/providers";
import Navbar from "../components/ui/navbar";
import "@/lib/rpc/server";
import TransitionLayout from "@/components/transition";
import Footer from "@/components/ui/footer";

const monoFont = Google_Sans_Code({
	subsets: ["latin"],
	variable: "--font-code",
	weight: "variable",
	fallback: ["serif"],
});

const ritFont = localFont({
	src: [
		{
			path: "../fonts/RITXThin.ttf",
			weight: "100",
			style: "normal",
		},
		{
			path: "../fonts/RITXThinItalic.ttf",
			weight: "100",
			style: "italic",
		},
		{
			path: "../fonts/RITThin.ttf",
			weight: "200",
			style: "normal",
		},
		{
			path: "../fonts/RITThinItalic.ttf",
			weight: "200",
			style: "italic",
		},
		{
			path: "../fonts/RITLight.ttf",
			weight: "300",
			style: "normal",
		},
		{
			path: "../fonts/RITLightItalic.ttf",
			weight: "300",
			style: "italic",
		},
		{
			path: "../fonts/RITRegular.ttf",
			weight: "400",
			style: "normal",
		},
		{
			path: "../fonts/RITRegularItalic.ttf",
			weight: "400",
			style: "italic",
		},
		{
			path: "../fonts/RITMedium.ttf",
			weight: "500",
			style: "normal",
		},
		{
			path: "../fonts/RITMediumItalic.ttf",
			weight: "500",
			style: "italic",
		},
		{
			path: "../fonts/RITBold.ttf",
			weight: "700",
			style: "normal",
		},
		{
			path: "../fonts/RITBoldItalic.ttf",
			weight: "700",
			style: "italic",
		},
		{
			path: "../fonts/RITBlack.ttf",
			weight: "900",
			style: "normal",
		},
		{
			path: "../fonts/RITBlackItalic.ttf",
			weight: "900",
			style: "italic",
		},
	],
	variable: "--font-rit",
});

export const metadata: Metadata = {
	title: "Pawprints",
	description: "Make your mark on RIT with Pawprints.",
	openGraph: {
		images: [
			{
				url: "/logo.png",
			},
		],
	},
	twitter: {
		card: "summary",
	},
};

const RootLayout: FC<PropsWithChildren> = async ({ children }) => {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${ritFont.variable} ${monoFont.variable} antialiased`}>
				<Providers>
					<Navbar />
					<TransitionLayout>{children}</TransitionLayout>
					<Footer />
				</Providers>
			</body>
		</html>
	);
};

export default RootLayout;
