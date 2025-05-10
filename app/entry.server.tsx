import { isbot } from "isbot";
import React from "react"; // Import React
import { renderToReadableStream } from "react-dom/server";
import type { AppLoadContext, EntryContext } from "react-router";
import { ServerRouter } from "react-router";

// React Router will call this if exported, for all uncaught errors in loaders, actions, etc.
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
	// In a real app, you would send this to an error reporting service
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
				// Log streaming rendering errors from inside the shell.  Don't log
				// errors encountered during initial shell rendering since they'll
				// reject and get logged in handleDocumentRequest.
				if (shellRendered) {
					if (process.env.NODE_ENV !== "production") console.error(error);
				}
			},
		},
	);
	shellRendered = true;

	// Ensure requests from bots and SPA Mode renders wait for all content to load before responding
	// https://react.dev/reference/react-dom/server/renderToPipeableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation
	if ((userAgent && isbot(userAgent)) || routerContext.isSpaMode) {
		await body.allReady;
	}

	responseHeaders.set("Content-Type", "text/html");
	return new Response(body, {
		headers: responseHeaders,
		status: responseStatusCode,
	});
}
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
				// Log streaming rendering errors from inside the shell.  Don't log
				// errors encountered during initial shell rendering since they'll
				// reject and get logged in handleDocumentRequest.
				if (shellRendered) {
					console.error(error);
				}
			},
		},
	);
	shellRendered = true;

	// Ensure requests from bots and SPA Mode renders wait for all content to load before responding
	// https://react.dev/reference/react-dom/server/renderToPipeableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation
	if ((userAgent && isbot(userAgent)) || routerContext.isSpaMode) {
		await body.allReady;
	}

	responseHeaders.set("Content-Type", "text/html");
	return new Response(body, {
		headers: responseHeaders,
		status: responseStatusCode,
	});
}
