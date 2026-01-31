import type { FC } from "react";

const ErrorPage: FC<{
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}> = async ({ searchParams: raw }) => {
	const searchParams = await raw;
	const error = searchParams["error"] || "UNKNOWN";
	const errorDescription =
		searchParams["error_description"] || "No further details.";

	return (
		<div className="h-[calc(100dvh-4rem)] mt-16 w-dvw flex flex-col items-center justify-center p-8">
			<h6 className="border rounded-lg p-4 flex flex-col items-center">
				<span>Error Logging In</span>
				<code>
					{error}: {errorDescription}
				</code>
			</h6>
		</div>
	);
};

export default ErrorPage;
