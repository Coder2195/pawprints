import { ErrorMessage } from "formik";
import type { FC, HTMLProps } from "react";
import { BiError } from "react-icons/bi";

const ErrorDiv: FC<HTMLProps<HTMLDivElement>> = ({
	children,
	className,
	...props
}) => {
	if (
		!children ||
		typeof children === "number" ||
		typeof children === "boolean"
	)
		return null;
	return (
		<div
			className={`bg-red text-white p-1 rounded-md mt-2 text-sm/4 flex items-center gap-1 ${className}`}
			{...props}
		>
			<BiError className="h-full w-5" />
			<span className="flex-1">{children}</span>
		</div>
	);
};

export const FieldError: FC<
	HTMLProps<HTMLDivElement> & {
		name: string;
	}
> = ({ name, ...props }) => {
	return (
		<ErrorMessage
			render={(d) => <ErrorDiv {...props}>{d}</ErrorDiv>}
			name={name}
		/>
	);
};

export default ErrorDiv;
