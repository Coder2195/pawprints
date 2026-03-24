export interface PawprintContent {
	title: string;
	description: string;
	tags: string[];
	id?: string;
}

export interface PawprintResponseContent {
	content: string;
	id?: string;
}

export type SortableFields =
	keyof typeof import("../constants").SORTABLE_FIELDS;
