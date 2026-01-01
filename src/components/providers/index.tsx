"use client";
import { ThemeProvider } from "next-themes";
import { FC, PropsWithChildren } from "react";
import { ProgressProvider } from "@bprogress/next/app";

const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider
      attribute="data-theme"
      themes={["dark", "light"]}
      storageKey="theme"
      enableSystem
    >
      <ProgressProvider
        height="4px"
        color="var(--color-orange)"
        options={{ showSpinner: false }}
        shallowRouting
      >
        {children}
      </ProgressProvider>
    </ThemeProvider>
  );
};

export default Providers;
