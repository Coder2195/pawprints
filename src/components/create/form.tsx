"use client";

import { useMutation } from "@tanstack/react-query";
import { Field, Form, Formik } from "formik";
import type { FC } from "react";
import { MdOutlineCheck } from "react-icons/md";
import { TAGS } from "@/lib/constants";
import { orpc } from "@/lib/rpc";
import type { PawprintContent } from "@/lib/types";
import { useToasts } from "../providers/toast";

const PawprintForm: FC<{ initialData: PawprintContent }> = ({
	initialData,
}) => {
	const saveDraft = useMutation(orpc.saveDraftPawprint.mutationOptions());
	const { addToast } = useToasts();

	return (
		<Formik
			initialValues={initialData}
			onSubmit={(values) => {
				alert("stub submit handler, still WIP");
			}}
		>
			{({ setFieldValue, values, setErrors, resetForm }) => (
				<Form className="py-4 p-2 flex flex-col gap-4">
					<div>
						<label htmlFor="form-title" className="font-bold text-xl">
							Title
						</label>
						<Field
							type="text"
							name="title"
							id="form-title"
							className="w-full"
							placeholder="Untitled Pawprint"
						/>
					</div>
					<div>
						<label htmlFor="form-description" className="font-bold text-xl">
							Form Description
						</label>
						<Field
							as="textarea"
							name="description"
							id="form-description"
							placeholder="Describe what changes you want..."
							className="w-full h-56"
						/>
					</div>

					<div>
						<label htmlFor="form-tags" className="font-bold text-xl">
							Tags
						</label>
						<div className="flex flex-wrap gap-2" id="form-tags">
							{Object.entries(TAGS).map(([key, value]) => {
								const selected = values.tags.includes(key);
								return (
									<button
										type="button"
										key={key}
										onClick={() => {
											setFieldValue(
												"tags",
												selected
													? values.tags.filter((t) => t !== key)
													: [...values.tags, key],
											);
										}}
										className={`button flex gap-1 items-center ${
											selected ? "button-primary" : "button-transparent border"
										}`}
									>
										{selected && <MdOutlineCheck aria-label="Enabled" />}{" "}
										{value}
									</button>
								);
							})}
						</div>
					</div>
					<div className="flex justify-around p-2">
						<button
							type="button"
							onClick={async () => {
								saveDraft.mutate(values, {
									onSuccess: (data) => {
										addToast({
											title: `${data.title || "Untitled Pawprint"} saved as draft!`,
											body: "Your draft has been saved successfully.",
											type: "success",
											liveTime: 3000,
										});
										resetForm();
									},
								});

								resetForm();
							}}
							className="button button-transparent text-orange border"
						>
							Save As Draft
						</button>
						<button type="button" className="button button-primary">
							Submit
						</button>
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default PawprintForm;
