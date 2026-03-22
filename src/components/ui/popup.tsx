"use client";

import { easeOut, motion } from "motion/react";
import type { FC, PropsWithChildren, ReactNode } from "react";
import { BiX } from "react-icons/bi";

const OverlayPopup: FC<
	PropsWithChildren & {
		title: ReactNode;
		onClose: () => void;
	}
> = ({ title, children, onClose }) => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.5 } }}
			exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.5 } }}
			className="w-dvw h-dvh bg-pms-430c/20 backdrop-blur-xs z-50 fixed top-0 left-0 flex items-center"
			onClick={(e) => {
				if (e.target !== e.currentTarget) return;
				onClose();
			}}
		>
			<motion.dialog
				open
				className="min-h-3/4 min-w-3/4 h-[min(calc(600px),calc(100%-1rem))] w-[min(calc(600px),calc(100%-1rem))] bg-solid border rounded-xl flex flex-col justify-stretch justify-self-center"
				initial={{
					translateY: "20%",
					opacity: 0,
				}}
				animate={{
					translateY: "0%",
					opacity: 1,
					transition: {
						delay: 0.9,
						duration: 0.3,
						ease: easeOut,
					},
				}}
				exit={{
					translateY: "20%",
					opacity: 0,
					transition: {
						duration: 0.3,
					},
				}}
			>
				<div className="flex flex-row items-start h-15 flex-none border-b">
					<h3 className="whitespace-nowrap flex-1 overflow-x-auto overflow-y-hidden px-3 pt-2 h-full">
						{title}
					</h3>
					<button
						type="button"
						className="icon-button button-transparent rounded-full w-9 h-9 m-1 p-1 flex items-center justify-center"
						onClick={onClose}
					>
						<BiX size={28} className="w-full h-full" />
					</button>
				</div>

				<div className="flex-1 overflow-auto flex-col flex">{children}</div>
			</motion.dialog>
		</motion.div>
	);
};

export default OverlayPopup;
