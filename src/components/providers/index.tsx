"use client";
import { ProgressProvider } from "@bprogress/next/app";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import type { FC, PropsWithChildren } from "react";
import { queryClient } from "@/lib/utils";
import AppAblyProvider from "./ably";
import ToastProvider from "./toast";

const Providers: FC<PropsWithChildren> = ({ children }) => {
	return (
		<QueryClientProvider client={queryClient}>
			<AppAblyProvider>
				<ThemeProvider
					attribute="data-theme"
					themes={["dark", "light"]}
					storageKey="theme"
					enableSystem
				>
					<ToastProvider>
						<ProgressProvider
							height="4px"
							color="var(--color-orange)"
							options={{ showSpinner: false }}
							shallowRouting
						>
							{children}
						</ProgressProvider>
					</ToastProvider>
				</ThemeProvider>
			</AppAblyProvider>
		</QueryClientProvider>
	);
};

export default Providers;
