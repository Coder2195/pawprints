"use client";
import { AnimatePresence, motion } from "motion/react";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePathname } from "next/navigation";
import { type FC, type PropsWithChildren, useContext, useRef } from "react";
import HomePage from "../home";

const FrozenRouter: FC<PropsWithChildren> = ({ children }) => {
	const context = useContext(LayoutRouterContext);
	// eslint-disable-next-line react-hooks/refs
	const frozen = useRef(context).current;

	return (
		<LayoutRouterContext.Provider value={frozen}>
			{children}
		</LayoutRouterContext.Provider>
	);
};

const TransitionLayout: FC<PropsWithChildren> = ({ children }) => {
	const pathname = usePathname();
	const show =
		pathname === "/" ||
		pathname.startsWith("/pawprint/") ||
		pathname === "/create";
	return (
		<div className="min-h-[120dvh]">
			<AnimatePresence>
				<motion.div
					key={pathname}
					initial={{ display: "none" }}
					animate={{
						display: "block",
						transition: { delay: 0.5, duration: 0.5 },
					}}
				>
					<FrozenRouter>{children}</FrozenRouter>
				</motion.div>
			</AnimatePresence>
			<AnimatePresence>
				{show && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{
							opacity: 1,
							transition: { duration: 0.5, delay: 0.5 },
						}}
						exit={{ opacity: 0 }}
						key="homepage"
					>
						<HomePage />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default TransitionLayout;
