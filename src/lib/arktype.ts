import { type } from "arktype";
import { configure } from "arktype/config";
import { TAGS_LIST } from "./constants";

// use the "arktype/config" entrypoint
configure({
	onUndeclaredKey: "delete",
});

export const pawprintDraftValidation = type({
	"id?": "string",
	title: type("string <= 256"),
	description: type("string <= 10000"),
	tags: type.string.array(),
});

export const pawprintPublishValidation = type({
	"id?": "string",
	title: type("10 <= string <= 256").configure({
		problem: (ctx) =>
			ctx.code === "minLength"
				? "title must be at least 10 characters long"
				: `${ctx.actual} isn't ${ctx.expected}`,
	}),
	description: type("50 <= string <= 10000").configure({
		problem: (ctx) =>
			ctx.code === "minLength"
				? "description must be at least 50 characters long"
				: `${ctx.actual} isn't ${ctx.expected}`,
	}),
	tags: type.string
		.array()
		.moreThanLength(0)
		.narrow((tags, ctx) => {
			for (const t of tags) if (TAGS_LIST.includes(t)) return true;
			throw ctx.reject("no valid tags provided");
		})
		.pipe((tags) => {
			const set = new Set(tags).intersection(new Set(TAGS_LIST));
			return Array.from(set);
		})
		.configure({
			problem: (ctx) =>
				ctx.code === "minLength"
					? "at least one tag is required"
					: `${ctx.actual} isn't ${ctx.expected}`,
		}),
});

export const responseDraftValidation = type({
	pawprintId: "string",
	"id?": "string | undefined",
	content: type("string <= 5000"),
});

export const responsePublishValidation = type({
	pawprintId: "string",
	"id?": "string | undefined",
	content: type("20 <= string <= 5000").configure({
		problem: (ctx) =>
			ctx.code === "minLength"
				? "content must be at least 20 characters long"
				: `${ctx.actual} isn't ${ctx.expected}`,
	}),
});
