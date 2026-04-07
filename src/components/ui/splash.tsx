"use client";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import type { FC } from "react";
import { authClient } from "@/lib/auth/client";
import { useIsMounted } from "@/lib/hooks";

const Splash: FC = () => {
	const { isPending } = authClient.useSession();
	const mounted = useIsMounted();

	return (
		<AnimatePresence>
			{isPending && !mounted && (
				<motion.div
					exit={{
						opacity: 0,
						scale: 2,
					}}
					className="w-dvw h-dvh flex items-center justify-center fixed left-0 top-0 z-1000 bg-solid"
				>
					<Image
						src="/logo.png"
						alt="Pawprints Logo"
						className="rounded-full animate-pulse"
						width={128}
						height={128}
					/>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default Splash;
