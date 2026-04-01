"use client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { type FC, useState } from "react";
import { authClient } from "@/lib/auth/client";
import { type GetPawprintResult, orpc } from "@/lib/rpc";
import OverlayPopup from "../ui/popup";
import Dialogue from "./dialogue";
import PawprintResponseForm from "./response-form";
import SignSection from "./sign";

const OverlayPawprint: FC<{
	pawprint: NonNullable<GetPawprintResult>;
	onClose?: () => void;
}> = ({ pawprint: initial, onClose }) => {
	const [pawprint, setPawprint] = useState(initial);
	const router = useRouter();

	const { data } = authClient.useSession();

	const showDrafts =
		data?.user.accountType === "ADMIN" &&
		(!pawprint.expiresOn || pawprint.expiresOn > new Date()) &&
		!pawprint.completedOn;

	const [responses, setResponses] = useState(pawprint.responses);

	const drafts = useQuery(
		orpc.getDraftResponses.queryOptions({
			enabled: showDrafts,
			input: {
				pawprintId: pawprint.id,
			},
		}),
	);

	const showResponses = pawprint.publishedOn && responses.length > 0;

	return (
		<OverlayPopup
			onClose={
				onClose ||
				(() => {
					router.push("/");
				})
			}
			title={pawprint.title}
		>
			<div className="flex-1 flex flex-col gap-2 p-2 overflow-auto">
				<Dialogue
					name={pawprint.author?.name}
					avatar={pawprint.author?.avatar || undefined}
					createdOn={pawprint.createdOn}
					updatedOn={pawprint.updatedOn}
				>
					{pawprint.description}
				</Dialogue>
				{(showResponses || showDrafts) && <hr className="-mx-2" />}
				<div className="flex gap-2 flex-col">
					<PawprintResponseForm
						setResponses={setResponses}
						response={{
							content: "",
						}}
						pawprintId={pawprint.id}
					/>
					{showDrafts &&
						(drafts.isLoading ? (
							<div className="p-4">Loading responses...</div>
						) : drafts.data !== undefined ? (
							drafts.data.map((draft) => (
								<PawprintResponseForm
									setResponses={setResponses}
									key={draft.id}
									response={draft}
									profile={draft.author || undefined}
									pawprintId={pawprint.id}
								/>
							))
						) : (
							<div>Error</div>
						))}
				</div>
				{showResponses && (
					<>
						<h5 className="sm:ml-14">Updates</h5>
						{responses.map((response, index) => (
							<Dialogue
								name={response.author?.name}
								ping={index === 0}
								avatar={response.author?.avatar || undefined}
								key={response.id}
								createdOn={response.createdOn}
								updatedOn={response.updatedOn}
							>
								{response.content}
							</Dialogue>
						))}
					</>
				)}
			</div>

			{pawprint.publishedOn && (
				<SignSection pawprint={pawprint} setPawprint={setPawprint} />
			)}
		</OverlayPopup>
	);
};

export default OverlayPawprint;
