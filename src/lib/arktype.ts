import { configure } from "arktype/config";

// use the "arktype/config" entrypoint
configure({
	onUndeclaredKey: "delete",
});
