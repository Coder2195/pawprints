"use client";

import { BProgress } from "@bprogress/core";
import { Field, Form, Formik } from "formik";
import Image from "next/image";
import type { FC } from "react";
import { FiUpload } from "react-icons/fi";
import { authClient, signIn } from "@/lib/auth/client";
import { client } from "@/lib/rpc";
import type { FreeImageResponse } from "@/lib/types/freeimage";
import { useToasts } from "../providers/toast";

const EditProfile: FC = () => {
	const { data, isPending, refetch, isRefetching } = authClient.useSession();
	const { addToast } = useToasts();
	const className =
		"border rounded-lg w-full md:w-1/3 p-2 py-6 flex justify-center items-center flex-col gap-2";

	if (isPending || isRefetching)
		return (
			<div className={className}>
				<b>Loading...</b>
			</div>
		);
	if (!data && !isPending) signIn();

	return (
		<Formik
			initialValues={{
				avatar: data?.user.image,
				name: data?.user.name || "No name provided.",
			}}
			onSubmit={async (data) => {
				BProgress.start();

				await client.editProfile(data);
				await refetch();

				BProgress.done();
			}}
		>
			{({
				values,
				setFieldValue,
				initialValues,

				/* and other goodies */
			}) => {
				const changed =
					values.avatar !== initialValues.avatar ||
					values.name !== initialValues.name;
				return (
					<Form className={className}>
						{isPending ? (
							<b>Loading...</b>
						) : (
							<button
								type="button"
								className="w-24 h-24 rounded-full overflow-hidden relative"
							>
								<Image
									src={values.avatar || "/pawprints.svg"}
									width={100}
									height={100}
									alt="Avatar"
									className="w-full h-full"
								/>
								<div className="w-full h-full absolute top-0 left-0 flex items-center justify-center z-10 hover:opacity-100 opacity-0 bg-black/50 transition-opacity duration-300 ease-in-out ">
									<input
										type="file"
										className="opacity-0 w-full h-full z-10 absolute top-0 left-0 cursor-pointer"
										accept="image/*"
										onChange={async (e) => {
											const elm = e.currentTarget;
											const file = elm.files?.item(0);

											if (!file) return;

											elm.disabled = true;
											BProgress.start();

											const formData = new FormData();
											formData.append("source", file);

											const res = await fetch("/api/upload-image", {
												method: "POST",
												body: formData,
											});

											elm.disabled = false;
											BProgress.done();

											elm.value = "";

											if (res.status === 200) {
												const data = (await res.json()) as FreeImageResponse;

												setFieldValue("avatar", data.image.url);
											} else {
												addToast({
													title: "Upload failed",
													body: (
														<>
															Could not upload image, please try again later.{" "}
															<br />
															<code>
																<b>Error: </b>
																{
																	await (res.headers
																		.get("content-type")
																		?.includes("application/json")
																		? res.json()
																		: res.text())
																}
															</code>
														</>
													),
													liveTime: 5000,
													type: "error",
												});
											}
										}}
									/>
									<FiUpload className="w-1/3 h-1/3 text-white" />
								</div>
							</button>
						)}
						<Field type="text" name="name" placeholder="Name" />
						<button
							type="submit"
							className="button button-primary"
							disabled={!changed}
						>
							Save Changes
						</button>
					</Form>
				);
			}}
		</Formik>
	);
};

export default EditProfile;
