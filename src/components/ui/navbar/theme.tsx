"use client";
import { useTheme } from "next-themes";
import { FC, useEffect, useRef, useState } from "react";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";

const ThemeButton: FC = () => {
  const theme = useTheme();

  const { resolvedTheme, setTheme } = theme;
  const ref = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(!!ref.current);

    return () => setMounted(false);
  }, []);

  return (
    <button
      ref={ref}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="p-2 hover:bg-pms-429c/30 rounded-full transition-colors duration-300 ease-in-out"
      disabled={!mounted}
    >
      {!mounted ? (
        ""
      ) : resolvedTheme === "dark" ? (
        <MdOutlineDarkMode size={28} />
      ) : (
        <MdOutlineLightMode size={28} />
      )}
    </button>
  );
};

export default ThemeButton;
