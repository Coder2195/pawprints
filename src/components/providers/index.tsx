"use client";
import { ThemeProvider } from "next-themes";
import { FC, PropsWithChildren } from "react";

const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider
      attribute="data-theme"
      themes={["dark", "light"]}
      storageKey="theme"
      enableSystem
    >
      {children}
    </ThemeProvider>
  );
};

export default Providers;
