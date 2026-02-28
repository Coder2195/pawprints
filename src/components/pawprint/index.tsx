"use client";
import { useRouter } from "next/navigation";
import { type FC, useState } from "react";
import type { GetPawprintResult } from "@/lib/rpc";
import OverlayPopup from "../ui/popup";
import Dialogue from "./dialogue";
import SignSection from "./sign";

const OverlayPawprint: FC<{ pawprint: NonNullable<GetPawprintResult> }> = ({
	pawprint: initial,
}) => {
	const [pawprint, setPawprint] = useState(initial);

	const router = useRouter();

	return (
		<OverlayPopup
			onClose={() => {
				router.push("/");
			}}
			title={pawprint.title}
		>
			<div className="flex-1 flex flex-col gap-2 p-2 overflow-auto">
				<Dialogue
					name={pawprint.author?.name}
					avatar={pawprint.author?.avatar || undefined}
					createdOn={pawprint.createdOn}
					updatedOn={pawprint.updatedOn}
				>
					<p>{pawprint.description}</p>
				</Dialogue>
				{pawprint.responses.length > 0 && (
					<>
						<hr className="-mx-2" />
						<h5 className="sm:ml-14">Updates</h5>
						{pawprint.responses.map((response, index) => (
							<Dialogue
								name={response.author?.name}
								ping={index === 0}
								avatar={response.author?.avatar || undefined}
								key={response.id}
								createdOn={response.createdOn}
								updatedOn={response.updatedOn}
							>
								<p>{response.content}</p>
							</Dialogue>
						))}
					</>
				)}
			</div>

			<SignSection pawprint={pawprint} setPawprint={setPawprint} />
		</OverlayPopup>
	);
};

export default OverlayPawprint;
