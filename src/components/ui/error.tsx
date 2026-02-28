import type { FC, HTMLProps } from "react";
import { BiError } from "react-icons/bi";

const ErrorDiv: FC<
	HTMLProps<HTMLDivElement> & {
		name?: string;
	}
> = ({ children, ...props }) => {
	if (
		!children ||
		typeof children === "number" ||
		typeof children === "boolean"
	)
		return null;
	return (
		<div className="bg-red text-white p-1 rounded-md mt-2 text-sm" {...props}>
			<BiError className="inline mr-1" />

			{children}
		</div>
	);
};

export default ErrorDiv;
