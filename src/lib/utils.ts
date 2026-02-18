import { QueryClient } from "@tanstack/react-query";
import { type } from "arktype";

export async function wait(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const queryClient = new QueryClient();

export const publishValidation = type({
	id: "string?",
	title: "string > 10",
	description: "string > 50",
	tags: "string[]",
});
