import { QueryClient } from "@tanstack/react-query";
import { type } from "arktype";
import { TAGS_LIST } from "./constants";
import "@/lib/arktype";

export async function wait(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const queryClient = new QueryClient();

export const publishValidation = type({
	id: "string?",
	title: type("string >= 10").describe(
		"Title must be at least 10 characters long.",
	),
	description: type("string >= 50").describe(
		"Description must be at least 50 characters long.",
	),
	tags: type.string
		.array()
		.moreThanLength(0)
		.describe("At least one tag is required", {
			kind: "minLength",
		})
		.narrow((tags, ctx) => {
			for (const t of tags) if (TAGS_LIST.includes(t)) return true;
			throw ctx.reject("No valid tags provided");
		})
		.pipe((tags) => {
			const set = new Set(tags).intersection(new Set(TAGS_LIST));
			return Array.from(set);
		}),
});
