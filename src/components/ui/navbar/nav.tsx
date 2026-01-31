"use client";

import { motion } from "motion/react";
import type { FC, PropsWithChildren } from "react";

const Nav: FC<PropsWithChildren> = ({ children }) => {
	return (
		<motion.nav
			className="flex gap-2 bg-primary relative p-2 justify-between items-center text-white rounded-xl restrict-width mx-auto h-12"
			initial={{
				scaleX: 0.5,
				opacity: 0,
			}}
			animate={{
				scaleX: 1,
				opacity: 1,
				transition: { duration: 0.75, type: "spring", bounce: 0.4 },
			}}
		>
			{children}
		</motion.nav>
	);
};

export default Nav;
