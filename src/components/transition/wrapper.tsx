"use client";

import { motion } from "motion/react";
import type { FC, PropsWithChildren } from "react";

const TransitionWrapper: FC<PropsWithChildren> = ({ children }) => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1, transition: { delay: 0.5, duration: 0.5 } }}
			exit={{ opacity: 0, transition: { duration: 0.5 } }}
		>
			{children}
		</motion.div>
	);
};

export default TransitionWrapper;
