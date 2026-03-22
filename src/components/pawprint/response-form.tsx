"use client";
import Image from "next/image";
import type { FC } from "react";
import { authClient } from "@/lib/auth/client";

const PawprintResponseForm: FC = () => {
	const { data } = authClient.useSession();
	if (!data) return null;

	const {
		user: { image: avatar, name, accountType },
	} = data;

	if (accountType !== "ADMIN") return;

	return (
		<div className="flex flex-row justify-start gap-2 items-start">
			<Image
				src={avatar || "/pawprints.svg"}
				alt="Author Avatar"
				width={50}
				height={50}
				className="rounded-full mb-2 border-4 w-12 h-12 hidden sm:block"
			/>
			<div className="flex-1 flex flex-col overflow-auto bg-pms-427c/10 p-2 border  rounded-lg">
				<span className="font-medium relative">
					{name || "Anonymous User"} (Responding)
				</span>
				<div className="markdown mt-2">
					<textarea
						name="response"
						id="response"
						placeholder="Write your response..."
						className="bg-transparent border w-full"
					></textarea>
				</div>
			</div>
		</div>
	);
};

export default PawprintResponseForm;
