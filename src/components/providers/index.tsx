"use client";
import { ThemeProvider } from "next-themes";
import { FC, PropsWithChildren } from "react";
import { ProgressProvider } from "@bprogress/next/app";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/utils";

const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider
      attribute="data-theme"
      themes={["dark", "light"]}
      storageKey="theme"
      enableSystem
    >
      <QueryClientProvider client={queryClient}>
        <ProgressProvider
          height="4px"
          color="var(--color-orange)"
          options={{ showSpinner: false }}
          shallowRouting
        >
          {children}
        </ProgressProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default Providers;
