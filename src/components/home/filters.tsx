"use client";
import { type FC, useRef } from "react";
import { BiSearch } from "react-icons/bi";
import { MdOutlineCheck } from "react-icons/md";
import { SORTABLE_FIELDS, SORTABLE_FIELDS_LIST, TAGS } from "@/lib/constants";
import type { GetPawprintsInput } from "@/lib/rpc";
import type { SortableFields } from "@/lib/types";

type InputProps = {
	input: GetPawprintsInput;
	setInput: (value: GetPawprintsInput) => void;
};

const Tag: FC<InputProps & { id: string }> = ({ input, setInput, id }) => {
	const selected = input.tags?.includes(id);
	return (
		<button
			type="button"
			className={`button ${
				selected ? "button-primary" : "button-transparent"
			} border flex gap-1 items-center`}
			onClick={() => {
				setInput({
					...input,
					tags: selected
						? input.tags?.filter((tag) => tag !== id)
						: [...(input.tags || []), id],
				});
			}}
		>
			{selected && <MdOutlineCheck aria-label="Enabled" />}
			{TAGS[id as keyof typeof TAGS]}
		</button>
	);
};

const Filters: FC<InputProps> = ({ input, setInput }) => {
	const ref = useRef<HTMLInputElement>(null);

	return (
		<div className="p-4 flex flex-col gap-3">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					if (!ref.current) return;
					ref.current.value = ref.current.value.trim();
					if (ref.current.value === input.search) return;
					setInput({
						...input,
						search: ref.current.value || undefined,
					});
				}}
				className="flex gap-2 w-full items-stretch"
			>
				<label htmlFor="search-text" className="flex items-center">
					<BiSearch size={30} className="h-3/4" aria-label="Search for: " />
				</label>
				<input
					className="flex-1 min-w-0"
					type="text"
					id="search-text"
					name="search-text"
					placeholder="Text to search"
					onBlur={(e) => {
						(e.currentTarget.parentElement as HTMLFormElement).requestSubmit();
					}}
					ref={ref}
				/>
			</form>
			<div className="flex gap-1 flex-wrap items-center">
				<br />
				<b className="mr-2">Tags:</b>
				{Object.keys(TAGS).map((key) => (
					<Tag input={input} setInput={setInput} key={key} id={key} />
				))}
			</div>
			<div className="flex gap-1 items-center">
				<b>Sort by: </b>
				<select
					className="button border button-transparent"
					onChange={(e) => {
						setInput({
							...input,
							orderBy: {
								...input.orderBy,
								field:
									(e.currentTarget.value as SortableFields) || "published_on",
							},
						});
					}}
				>
					{SORTABLE_FIELDS_LIST.map((field) => (
						<option key={field} value={field}>
							{SORTABLE_FIELDS[field]}
						</option>
					))}
				</select>
				<button
					type="button"
					className="button button-transparent border"
					onClick={() => {
						setInput({
							...input,
							orderBy: {
								...input.orderBy,
								direction: input.orderBy?.direction === "asc" ? "desc" : "asc",
							},
						});
					}}
				>
					{input.orderBy?.direction === "asc" ? "Ascending" : "Descending"}
				</button>
			</div>
		</div>
	);
};

export default Filters;
