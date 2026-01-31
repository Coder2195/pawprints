"use client";

import { type FC, type PropsWithChildren, useState } from "react";
import { BiPlus } from "react-icons/bi";

const Dropdown: FC<PropsWithChildren> = ({ children }) => {
	const [opened, setOpened] = useState(false);

	return (
		<div className="flex 2xs:hidden flex-1">
			<span className="flex flex-1 justify-center">
				<button
					type="button"
					className="icon-button button-transparent w-8 h-8"
					onClick={() => {
						setOpened(!opened);
					}}
				>
					<BiPlus
						size={28}
						className={`w-6 h-6 -m-1 ${opened ? "rotate-135" : ""} transition-transform duration-300 ease-in-out`}
					/>
				</button>
			</span>
			<div
				className={`absolute left-0 top-[calc(100%+0.5rem)] rounded-lg w-full  ${opened ? "max-h-32" : "max-h-0 "} overflow-clip transition-[max-height] duration-500 ease-in-out bg-orange items-start z-40`}
			>
				{children}
			</div>
		</div>
	);
};

export default Dropdown;
