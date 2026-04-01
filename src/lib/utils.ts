import { QueryClient } from "@tanstack/react-query";
import "@/lib/arktype";

export async function wait(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const queryClient = new QueryClient();

export function dateHourMinute(date: Date) {
	return date.toLocaleString(undefined, {
		dateStyle: "long",
		timeStyle: "short",
	});
}
