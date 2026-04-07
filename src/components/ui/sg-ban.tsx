"use client";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { type FC, useEffect, useState } from "react";

const SGBan: FC = () => {
	const [show, setShow] = useState(true);

	const [hideImmediately, setHideImmediately] = useState(false);

	useEffect(() => {
		if (localStorage.getItem("fuckTheBan") === "true") setHideImmediately(true);
	});

	if (hideImmediately) return null;

	return (
		<AnimatePresence>
			{show && (
				<motion.div
					exit={{
						opacity: 0,
						scale: 2,
					}}
					className="w-dvw h-dvh flex items-center justify-center fixed left-0 top-0 z-100 bg-red-500 text-white flex-col gap-4 bg-solid"
				>
					<h1>Warning</h1>
					<div>
						Because of an memo saying that this website "undermines" RIT's
						student government, this is not an officially sanctioned website.
					</div>
					<button
						type="button"
						className="button button-primary font-bold border"
						onClick={() => {
							setShow(false);
							localStorage.setItem("fuckTheBan", "true");
						}}
					>
						Resist the university that gouges tuition by 4.5% per year.
					</button>
					<Link
						href="https://google.com"
						className="button button-red font-bold"
					>
						"Just comply", go to Google instead.
					</Link>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default SGBan;
