"use client";
import { useMutation } from "@tanstack/react-query";
import { type } from "arktype";
import { Field, Form, Formik, type FormikProps } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FC, useEffect } from "react";
import { MdOutlineCheck } from "react-icons/md";
import { TAGS } from "@/lib/constants";
import { orpc } from "@/lib/rpc";
import type { PawprintContent } from "@/lib/types";
import { publishValidation } from "@/lib/utils";
import { useToasts } from "../providers/toast";
import ErrorDiv from "../ui/error";
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

	useEffect(() => {
		setValues(initialValues);
	}, [initialValues, setValues]);
	return (
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
					onFocus={() => setFieldError("title", undefined)}
				/>
				<ErrorDiv>{touched.title && errors.title}</ErrorDiv>
			</div>

			<div>
				<label htmlFor="form-description" className="font-bold text-xl ">
					Description
				</label>
				<div className="flex lg:flex-row flex-col gap-2 relative">
					<Field
						as="textarea"
						name="description"
						id="form-description"
						placeholder="Describe what changes you want..."
						className="min-h-36 lg:min-w-48 lg:w-1/2 max-w-full lg:resize resize-y"
						onFocus={() => setFieldError("description", undefined)}
					/>

					<div className="flex-1 markdown border p-2 rounded-lg wrap-break-word overflow-scroll min-h-36 lg:min-w-48 lg:min-h-auto contain-size">
						{values.description ? (
							<Markdown>{values.description}</Markdown>
						) : (
							<div className="text-pms-430c text-base/4 select-none">
								Begin typing to see a live preview...
							</div>
						)}
						<span className="right-2 bottom-1 text-xs absolute bg-solid px-1">
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
				<ErrorDiv>{touched.description && errors.description}</ErrorDiv>
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
				<ErrorDiv>{touched.tags && errors.tags}</ErrorDiv>
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
				<button type="submit" className="button button-primary">
					Submit
				</button>
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
			validateOnChange={false}
			onSubmit={async (values, { setFieldError }) => {
				const result = publishValidation(values);

				if (result instanceof type.errors) {
					const map = result.flatByPath;

					for (const key in map) {
						setFieldError(key, map[key][0].description || "Invalid value");
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
			{(props) => <FormContent {...props} initialValues={initialData} />}
		</Formik>
	);
};

export default PawprintForm;
