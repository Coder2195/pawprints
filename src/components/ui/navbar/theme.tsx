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

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="icon-button button-transparent"
    >
      {resolvedTheme === "dark" ? (
        <MdOutlineDarkMode aria-label="Switch to light mode" size={28} />
      ) : (
        <MdOutlineLightMode aria-label="Switch to dark mode" size={28} />
      )}
    </button>
  );
};

export default ThemeButton;
