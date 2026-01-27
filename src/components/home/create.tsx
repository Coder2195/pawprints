import Link from "next/link";
import type { FC } from "react";
import { BiPlus } from "react-icons/bi";

const CreatePawprint: FC = () => {
	return (
		<Link
			href="/create"
			className="rounded-full button button-primary w-12 h-12 fixed bottom-4 right-4 flex justify-center items-center p-0"
		>
			<BiPlus aria-label="Create Pawprint" size={40} className="w-10 h-10" />
		</Link>
	);
};

export default CreatePawprint;
