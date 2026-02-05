"use client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { type FC, useState } from "react";
import { authClient, signIn } from "@/lib/auth/client";
import { EMPTY_PAWPRINT } from "@/lib/constants";
import { orpc } from "@/lib/rpc";
import type { PawprintContent } from "@/lib/types";
import OverlayPopup from "../ui/popup";
import PawprintForm from "./form";

const CreatePawprintClient: FC = () => {
	const router = useRouter();
	const { data, isPending } = authClient.useSession();

	const needsLogin = !isPending && !data?.user;
	const canCreate = !needsLogin && data?.user.accountType !== "GUEST";

	const [initialData, setInitialData] =
		useState<PawprintContent>(EMPTY_PAWPRINT);
	const [editMode, setEditMode] = useState(false);

	const drafts = useQuery(orpc.getDrafts.queryOptions({}));

	if (needsLogin) signIn();

	const loading = drafts.isPending || drafts.isRefetching;

	return (
		<OverlayPopup
			onClose={() => router.push("/")}
			title={
				isPending
					? "Loading..."
					: needsLogin
						? "Not Logged In"
						: canCreate
							? editMode
								? "Editing Draft Pawprint"
								: "Creating New Pawprint"
							: "Guests Cannot Create Pawprints"
			}
		>
			{canCreate ? (
				<>
					<div className="p-2">
						<button
							type="button"
							className="button button-primary w-full text-center"
							onClick={() => {
								// inverted because if not creating new its gonna change to creating new
								if (editMode) setInitialData(EMPTY_PAWPRINT);

								setEditMode(!editMode);
							}}
						>
							{editMode ? "Create New Pawprint" : "Edit A Draft"} Instead
						</button>

						<div
							className={`w-full transition-[height,border] ${editMode ? "h-50 border" : "h-0 border-0"} overflow-auto duration-500 mt-2 rounded-lg `}
						>
							<div className="p-2 flex flex-col h-full">
								<h5 className="h-8">Your Drafts</h5>
								<div className="flex flex-col gap-1 mb-2 flex-1 overflow-auto">
									{loading
										? "Loading..."
										: drafts.status === "error"
											? "An error occured while trying to retrieve your drafts"
											: drafts.data.map((draft) => (
													<button
														key={draft.id}
														type="button"
														className="button button-transparent border"
														onClick={() => {
															setInitialData(draft);
														}}
													>
														{draft.title || "Untitled Pawprint"}
													</button>
												))}
								</div>
								<div className="flex h-8 gap-2 flex-wrap items-center justify-center">
									<button
										disabled={loading}
										onClick={() => {
											if (loading) return;
											drafts.refetch();
										}}
										type="button"
										className="button button-transparent text-orange ml-2 border"
									>
										{loading ? "Loading..." : "Refetch?"}
									</button>
								</div>
							</div>
						</div>
					</div>

					<PawprintForm
						key={JSON.stringify(initialData)}
						initialData={initialData}
					/>
				</>
			) : (
				<div className="h-full w-full flex justify-center items-center text-center flex-col gap-4">
					<h6>
						{isPending
							? "Loading..."
							: needsLogin
								? "Please log in to create pawprints."
								: "Sorry, only members of RIT can create pawprints."}
					</h6>
					{!isPending && needsLogin && (
						<button
							type="button"
							onClick={signIn}
							className="button button-primary"
						>
							Log In
						</button>
					)}
				</div>
			)}
		</OverlayPopup>
	);
};

export default CreatePawprintClient;
