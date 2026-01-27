"use client";

import { createId } from "@paralleldrive/cuid2";
import { AnimatePresence } from "motion/react";
import {
	createContext,
	type FC,
	type PropsWithChildren,
	type ReactNode,
	useContext,
	useState,
} from "react";
import Toast from "../ui/toast";

export interface ToastData {
	type: "success" | "warning" | "error" | "information";
	title: ReactNode;
	body: ReactNode;
	liveTime: number;
}

interface Context {
	addToast(toast: ToastData): void;
}

const ToastContext = createContext<Context>(null as unknown as Context);

export function useToasts() {
	return useContext(ToastContext);
}

const ToastProvider: FC<PropsWithChildren> = ({ children }) => {
	const [toasts, setToasts] = useState<{ [key: string]: ReactNode }>({});

	return (
		<ToastContext.Provider
			value={{
				addToast(toast) {
					setToasts((old) => {
						const newToasts = { ...old };
						const id = createId();
						newToasts[id] = (
							<Toast
								id={id}
								key={id}
								toast={toast}
								remove={() => {
									setToasts((toasts) => {
										delete toasts[id];
										return { ...toasts };
									});
								}}
							/>
						);

						return newToasts;
					});
				},
			}}
		>
			{children}
			<div className="pointer-events-none bottom-0 right-0 fixed flex flex-col gap-2 p-2 z-100">
				<AnimatePresence>{Object.values(toasts)}</AnimatePresence>
			</div>
		</ToastContext.Provider>
	);
};

export default ToastProvider;
