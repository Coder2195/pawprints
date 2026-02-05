import { Field, Form, Formik } from "formik";
import type { FC } from "react";
import { client } from "@/lib/rpc";
import type { PawprintContent } from "@/lib/types";

const PawprintForm: FC<{ initialData: PawprintContent }> = ({
	initialData,
}) => {
	return (
		<Formik
			initialValues={initialData}
			onSubmit={(values) => {
				client.saveDraftPawprint(values);
			}}
		>
			<Form className="py-4 p-2">
				<h5>Title</h5>
				<Field
					type="text"
					name="title"
					className="w-full"
					placeholder="Untitled Pawprint"
				/>
				<h5>Description</h5>
				<Field
					as="textarea"
					name="description"
					placeholder="Describe what changes you want..."
					className="w-full h-56"
				/>
				<div className="flex justify-around p-2">
					<button
						type="submit"
						className="button button-transparent text-orange border"
					>
						Save As Draft
					</button>
					<button type="button" className="button button-primary">
						Submit
					</button>
				</div>
			</Form>
		</Formik>
	);
};

export default PawprintForm;
