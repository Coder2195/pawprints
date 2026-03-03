import Image from "next/image";
import type { FC, PropsWithChildren } from "react";
import { dateHourMinute } from "@/lib/utils";
import Markdown from "../ui/markdown";

type DialogueProps = {
	name?: string;
	updatedOn?: Date;
	createdOn?: Date;
	ping?: boolean;
	avatar?: string;
} & PropsWithChildren;
const Dialogue: FC<DialogueProps> = ({
	name,
	avatar,
	children,
	updatedOn,
	ping,
	createdOn,
}) => {
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
					{name || "Anonymous User"}
					{ping && (
						<span className="absolute top-0 right-0 flex size-3">
							<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange opacity-75"></span>
							<span className="inline-flex size-3 rounded-full bg-orange"></span>
						</span>
					)}
				</span>
				<div className="markdown my-2">
					{typeof children === "string" ? (
						<Markdown>{children}</Markdown>
					) : (
						children
					)}
				</div>
				{createdOn && (
					<span className="text-xs text-pms-429c">
						{updatedOn && createdOn?.getTime() !== updatedOn?.getTime() && (
							<>Updated {dateHourMinute(updatedOn)}, </>
						)}
						Created: {dateHourMinute(createdOn)}
					</span>
				)}
			</div>
		</div>
	);
};

export default Dialogue;
