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
      className="p-2 hover:bg-pms-429c/30 rounded-full transition-colors duration-300 ease-in-out"
    >
      {resolvedTheme === "dark" ? (
        <MdOutlineDarkMode size={28} />
      ) : (
        <MdOutlineLightMode size={28} />
      )}
    </button>
  );
};

export default ThemeButton;
