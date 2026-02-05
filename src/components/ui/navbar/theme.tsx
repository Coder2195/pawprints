"use client";
import { useTheme } from "next-themes";
import type { FC } from "react";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { useIsMounted as useMounted } from "@/lib/hooks";

const ThemeButton: FC = () => {
	const theme = useTheme();

	const { resolvedTheme, setTheme } = theme;
	const mounted = useMounted();

	if (!mounted) return null;

	const Icon =
		resolvedTheme === "dark" ? MdOutlineLightMode : MdOutlineDarkMode;

	return (
		<button
			type="button"
			onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
			className="icon-button button-transparent  h-8 w-8"
		>
			{
				<Icon
					aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
					size={36}
					className="w-6 h-6 -m-1"
				/>
			}
		</button>
	);
};

export default ThemeButton;
