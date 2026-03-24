import { QueryClient } from "@tanstack/react-query";
import { type } from "arktype";
import { TAGS_LIST } from "./constants";
import "@/lib/arktype";
import Ably, { type ChannelOptions } from "ably";

export async function wait(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const queryClient = new QueryClient();

export async function sendAblyEvent(
	channel: string,
	name: string,
	// biome-ignore lint/suspicious/noExplicitAny: message is literally any for ably
	message: any,
	channelOptions?: ChannelOptions,
) {
	const ablyClient = new Ably.Realtime({
		key: process.env.ABLY_ROOT_KEY,
	});

	await ablyClient.channels.get(channel, channelOptions).publish(name, message);
	ablyClient.close();
}

export const publishValidation = type({
	id: "string?",
	title: type("10 <= string <= 50").configure({
		problem: (ctx) => ctx.expected,
	}),
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

export const respondValidation = type({
	pawprintId: "string",
	id: "string?",
	content: type("string >= 20").describe(
		"Response must be at least 20 characters long.",
	),
});

export function dateHourMinute(date: Date) {
	return date.toLocaleString(undefined, {
		dateStyle: "long",
		timeStyle: "short",
	});
}
