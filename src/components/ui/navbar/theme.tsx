"use client";
import { useIsMounted as useMounted } from "@/lib/hooks";
import { useTheme } from "next-themes";
import { FC } from "react";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";

const ThemeButton: FC = () => {
  const theme = useTheme();

  const { resolvedTheme, setTheme } = theme;
  const mounted = useMounted();

  if (!mounted) return null;

  const Icon =
    resolvedTheme === "dark" ? MdOutlineLightMode : MdOutlineDarkMode;

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="icon-button button-transparent w-9 h-9"
    >
      {
        <Icon
          aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
          size={24}
          className="w-full h-full"
        />
      }
    </button>
  );
};

export default ThemeButton;
