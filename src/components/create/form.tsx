"use client";
import { useMutation } from "@tanstack/react-query";
import { type } from "arktype";
import { Field, Form, Formik, type FormikProps } from "formik";
import { AnimatePresence } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FC, useEffect, useRef, useState } from "react";
import { MdOutlineCheck } from "react-icons/md";
import { pawprintPublishValidation } from "@/lib/arktype";
import { authClient } from "@/lib/auth/client";
import { TAGS } from "@/lib/constants";
import { orpc } from "@/lib/rpc";
import type { PawprintContent } from "@/lib/types";
import { queryClient } from "@/lib/utils";
import OverlayPawprint from "../pawprint";
import { useToasts } from "../providers/toast";
import { FieldError } from "../ui/error";
import Markdown from "../ui/markdown";

const FormContent: FC<FormikProps<PawprintContent>> = ({
	setFieldValue,
	values,
	setValues,
	resetForm,
	initialValues,
	errors,
	touched,
	setFieldError,
}) => {
	const saveDraft = useMutation(orpc.saveDraftPawprint.mutationOptions());
	const { addToast } = useToasts();

	const [previewOpen, setPreviewOpen] = useState(false);

	const previewRef = useRef<HTMLDivElement>(null);
	const { data } = authClient.useSession();
	const previewEnabled = data !== null;

	useEffect(() => {
		setValues(initialValues);
	}, [initialValues, setValues]);

	return (
		<Form className="pt-0 p-4 flex flex-col gap-4">
			<div>
				<label htmlFor="form-title" className="font-bold text-xl">
					Title
				</label>
				<div className="relative">
					<Field
						type="text"
						name="title"
						id="form-title"
						className="w-full pr-16 peer"
						placeholder="Untitled Pawprint"
						maxLength={256}
						onFocus={() => setFieldError("title", undefined)}
					/>
					<span className="absolute left-1 bottom-0 translate-y-1/2 backdrop-blur-3xl text-xs/3 p-1 rounded-sm z-30 letter-count">
						{values.title.length}/256
					</span>
				</div>
				<FieldError name="title" />
			</div>

			<div>
				<label htmlFor="form-description" className="font-bold text-xl">
					Description
				</label>
				<div className="flex lg:flex-row flex-col gap-2 relative">
					<Field
						as="textarea"
						tabIndex={0}
						name="description"
						id="form-description"
						maxLength={10000}
						placeholder="Describe what changes you want..."
						className="min-h-36 lg:min-w-48 lg:w-1/2 min-w-full max-w-full lg:resize resize-y peer"
						onFocus={() => setFieldError("description", undefined)}
					/>
					<span className="absolute left-1 bottom-0 translate-y-1/2 backdrop-blur-3xl px-1 text-xs z-30 letter-count">
						{values.description.length}/10000
					</span>

					<div className="flex-1 markdown border p-2 rounded-lg wrap-break-word overflow-auto min-h-36 lg:min-w-48 lg:min-h-auto contain-size">
						{values.description ? (
							<Markdown>{values.description}</Markdown>
						) : (
							<div className="placeholder text-base/4 select-none">
								Begin typing to see a live preview...
							</div>
						)}
						<span className="right-1 bottom-0.5 text-xs absolute bg-solid px-2 p-0.5 rounded-md">
							need the{" "}
							<Link
								className="text-orange hover-underline font-bold"
								href="https://www.markdownguide.org/cheat-sheet/"
								target="_blank"
							>
								markdown guide?
							</Link>
						</span>
					</div>
				</div>
				<FieldError name="description" />
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
									setFieldError("tags", undefined);
									setFieldValue(
										"tags",
										selected
											? values.tags.filter((t) => t !== key)
											: [...values.tags, key],
									);
								}}
								className={`button flex gap-1 items-center border ${
									selected ? "button-primary" : "button-transparent "
								}`}
							>
								{selected && <MdOutlineCheck aria-label="Enabled" />} {value}
							</button>
						);
					})}
				</div>
				<FieldError name="tags" />
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
								queryClient.fetchQuery(orpc.getDraftPawprints.queryOptions({}));
							},
						});

						resetForm();
					}}
					className="button button-transparent text-orange border font-medium"
				>
					Save As Draft
				</button>
				<button
					type="button"
					className="button button-transparent text-orange disabled:text-pms-427c border font-medium"
					disabled={!previewEnabled}
					onClick={() => {
						setPreviewOpen(!previewOpen);
					}}
				>
					Preview
				</button>
				<button type="submit" className="button button-primary font-bold">
					Submit
				</button>

				<AnimatePresence>
					{previewOpen && previewEnabled && (
						<OverlayPawprint
							onClose={() => {
								setPreviewOpen(false);
							}}
							pawprint={{
								...values,
								id: "",
								title: values.title || "Untitled Pawprint",
								description: values.description || "[No description]",
								createdOn: new Date(),
								completedOn: new Date(),
								updatedOn: new Date(),
								publishedOn: null,
								userId: data.user.id,
								author: {
									...data.user,
									avatar: data.user.image,
									id: data.user.id,
								},
								expiresOn: new Date(),
								signs: 0,
								responses: [],
							}}
						/>
					)}
				</AnimatePresence>
			</div>
		</Form>
	);
};

const PawprintForm: FC<{ initialData: PawprintContent }> = ({
	initialData,
}) => {
	const { addToast } = useToasts();
	const router = useRouter();

	const publish = useMutation(orpc.publishPawprint.mutationOptions());

	return (
		<Formik
			initialValues={initialData}
			validateOnChange={true}
			onSubmit={async (values, { setFieldError }) => {
				const result = pawprintPublishValidation(values);

				if (result instanceof type.errors) {
					const map = result.flatByPath;

					for (const key in map) {
						setFieldError(key, map[key][0].problem || "Invalid value");
					}
					return;
				}

				publish.mutate(values, {
					onSuccess(data) {
						addToast({
							type: "success",
							title: "Pawprint Published",
							body: "Your pawprint has been published successfully.",
							liveTime: 4000,
						});
						router.push(`/pawprint/${data.id}`);
					},
				});
			}}
		>
			{(props) => {
				return <FormContent {...props} initialValues={initialData} />;
			}}
		</Formik>
	);
};

export default PawprintForm;
