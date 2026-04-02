"use client";
import { useMutation } from "@tanstack/react-query";
import { type } from "arktype";
import { Field, Form, Formik } from "formik";
import Image from "next/image";
import type { Dispatch, FC, SetStateAction } from "react";
import { responsePublishValidation } from "@/lib/arktype";
import { authClient } from "@/lib/auth/client";
import { type GetPawprintResultResponses, orpc } from "@/lib/rpc";
import type { PawprintResponseContent } from "@/lib/types";
import { queryClient } from "@/lib/utils";
import { useToasts } from "../providers/toast";
import { FieldError } from "../ui/error";
import Markdown from "../ui/markdown";

const PawprintResponseForm: FC<{
	response: PawprintResponseContent;
	profile?: {
		name: string;
		avatar: string | null;
	};
	pawprintId: string;
	setResponses: Dispatch<SetStateAction<GetPawprintResultResponses>>;
}> = ({ response, profile, pawprintId, setResponses }) => {
	const { data } = authClient.useSession();
	const publish = useMutation(orpc.publishResponse.mutationOptions());
	const saveDraft = useMutation(orpc.saveDraftResponse.mutationOptions());
	const deleteDraft = useMutation(orpc.deleteResponse.mutationOptions());
	const { addToast } = useToasts();
	if (!data || !data?.user) return null;

	if (data.user.accountType !== "ADMIN") return;

	const name = profile?.name || data.user.name;
	const avatar = profile?.avatar || data.user.image;

	const disabled =
		saveDraft.isPending || publish.isPending || deleteDraft.isPending;

	return (
		<div className="flex flex-row justify-start gap-2 items-start">
			<Image
				src={avatar || "/pawprints.svg"}
				alt="Author Avatar"
				width={50}
				height={50}
				className="rounded-full mb-2 border-4 w-12 h-12 hidden sm:block"
			/>
			<Formik
				initialValues={response}
				onSubmit={async (rawValues, { setFieldError, setValues }) => {
					const values = {
						...rawValues,
						pawprintId,
					};
					const result = responsePublishValidation(values);

					if (result instanceof type.errors) {
						const map = result.flatByPath;

						for (const key in map) {
							console.log(map[key][0].problem);
							setFieldError(key, map[key][0].problem || "Invalid value");
						}

						console.log(map);
						return;
					}

					publish.mutate(values, {
						onError(e) {
							addToast({
								type: "error",
								title: "Error Publishing Response",
								body: (
									<>
										An error occured trying to publish your response.
										<br />
										<code>
											{e.name}: {e.message}
										</code>
									</>
								),
								liveTime: 4000,
							});
						},
						onSuccess(returning) {
							addToast({
								type: "success",
								title: "Response Published",
								body: "Your response has been published successfully.",
								liveTime: 4000,
							});

							setValues({
								content: "",
								id: undefined,
							});

							setResponses((prev) => [
								{
									...returning,
									author: {
										name: name,
										avatar: avatar,
									},
								},
								...prev,
							]);
						},
					});
				}}
			>
				{({ values, setValues }) => (
					<Form className="flex-1 flex flex-col overflow-auto bg-pms-427c/10 p-2 border rounded-lg">
						<span className="font-medium relative">
							{name || "Anonymous User"} (
							{response.id ? "Existing Draft" : "New Response"})
						</span>

						<div className="relative">
							<label htmlFor="content" className="font-bold mt-2">
								Content
							</label>
							<Field
								maxLength={5000}
								as="textarea"
								name="content"
								id="content"
								placeholder="Write your response..."
								className="bg-transparent border w-full mt-2 pb-4 resize-y min-h-28"
							/>
							<span className="absolute left-1 bottom-0 translate-y-1/2 px-1 text-xs dark:text-pms-430c backdrop-blur-3xl p-0.5 rounded-md text-black/60">
								{values.content.length}/5000
							</span>
						</div>
						<FieldError name="content" />

						<b className="mt-2">Preview</b>
						<div className="markdown border p-2 rounded-md overflow-auto resize-y min-h-28">
							{values.content ? (
								<Markdown>{values.content}</Markdown>
							) : (
								<div className="text-black/60 dark:text-pms-430c text-base/4 select-none ">
									Begin typing to see a live preview...
								</div>
							)}
						</div>

						<div className="flex justify-between gap-2 mt-2">
							{response?.id && (
								<button
									type="button"
									className="button button-red border"
									disabled={disabled}
									onClick={() => {
										deleteDraft.mutate(
											// biome-ignore lint/style/noNonNullAssertion: response.id is defined
											{ id: response.id! },
											{
												onError(e) {
													addToast({
														type: "error",
														liveTime: 4000,
														title: "Error Deleting Draft",
														body: (
															<>
																An error occured trying to delete your draft.
																<br />
																<code>
																	{e.name}: {e.message}
																</code>
															</>
														),
													});
												},
												onSuccess(data, variables, onMutateResult, context) {
													addToast({
														type: "success",
														title: "Draft Deleted",
														body: "Your draft has been deleted successfully.",
														liveTime: 4000,
													});

													queryClient.setQueryData(
														orpc.getDraftResponses.queryKey({
															input: { pawprintId },
														}),
														(prev) =>
															(prev || []).filter((r) => r.id !== response.id),
													);
												},
											},
										);
									}}
								>
									Delete
								</button>
							)}
							<button
								type="button"
								className="button button-transparent border font-medium"
								disabled={disabled}
								onClick={() => {
									saveDraft.mutate(
										{ ...values, pawprintId },
										{
											onError(e) {
												addToast({
													type: "error",
													title: "Error Saving Draft",
													body: (
														<>
															An error occured trying to save your draft.
															<br />
															<code>
																{e.name}:{e.message}
															</code>
														</>
													),
													liveTime: 4000,
												});
											},
											onSuccess(e) {
												addToast({
													type: "success",
													title: "Draft Saved",
													body: "Your draft has been saved successfully.",
													liveTime: 4000,
												});

												if (!values.id) {
													queryClient.setQueryData(
														orpc.getDraftResponses.queryKey({
															input: { pawprintId },
														}),
														(prev) => [
															{
																...e,
																author: {
																	name,
																	avatar,
																},
															},
															...(prev || []),
														],
													);
													setValues({
														content: "",
														id: undefined,
													});
												}
											},
										},
									);
								}}
							>
								Save Draft
							</button>

							<button
								type="submit"
								disabled={disabled}
								className="button button-primary border font-bold"
							>
								Respond
							</button>
						</div>
					</Form>
				)}
			</Formik>
		</div>
	);
};

export default PawprintResponseForm;
