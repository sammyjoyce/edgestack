import { isbot } from "isbot";
import React from "react";
import { renderToReadableStream } from "react-dom/server";
import type { AppLoadContext, EntryContext } from "react-router";
import { ServerRouter } from "react-router";

export function handleError(error: unknown, { request, params, context }: any) {
	if (process.env.NODE_ENV !== "production") {
		console.error("[React Router handleError]", {
			errorType: typeof error,
			errorInstance: error instanceof Error,
			errorString: String(error),
			errorJson: (() => {
				try {
					return JSON.stringify(error);
				} catch {
					return null;
				}
			})(),
			error,
			requestUrl: request?.url,
			params,
			context,
		});
	}
}

export default async function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	routerContext: EntryContext,
	_loadContext: AppLoadContext,
) {
	let shellRendered = false;
	const userAgent = request.headers.get("user-agent");
	const body = await renderToReadableStream(
		<ServerRouter context={routerContext} url={request.url} />,
		{
			onError(error: unknown) {
				const statusCode = 500;
				if (shellRendered) {
					if (process.env.NODE_ENV !== "production") console.error(error);
				}
			},
		},
	);
	shellRendered = true;
	if ((userAgent && isbot(userAgent)) || routerContext.isSpaMode) {
		await body.allReady;
	}
	responseHeaders.set("Content-Type", "text/html");
	return new Response(body, {
		headers: responseHeaders,
		status: responseStatusCode,
	});
}
