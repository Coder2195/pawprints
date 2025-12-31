import type { Metadata } from "next";
import "./main.css";
import localFont from "next/font/local";
import Navbar from "../components/ui/navbar";
import { FC, ReactNode } from "react";
import Providers from "@/components/providers";
import "@/lib/rpc/server";

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
};

const RootLayout: FC<
  Readonly<{
    children: ReactNode;
    pawprint: ReactNode;
  }>
> = async ({ children, pawprint }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${ritFont.className} antialiased`}>
        <Providers>
          <Navbar />
          {children}
          {pawprint}
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
