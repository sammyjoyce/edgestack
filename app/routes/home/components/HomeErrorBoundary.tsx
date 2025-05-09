import React from "react";
import { isRouteErrorResponse, useRouteError } from "react-router";
import { SharedErrorBoundary } from "~/routes/common/components/ErrorBoundary";

export function HomeErrorBoundary() {
	const error = useRouteError();

	let title = "Error";
	let message = "An unexpected error occurred";
	let status = 500;

	if (isRouteErrorResponse(error)) {
		status = error.status;
		message = error.data?.message || error.statusText;
		title = `${status} - ${error.statusText}`;
	} else if (error instanceof Error) {
		message = error.message;
	}

	return (
		<SharedErrorBoundary
			title={title}
			message={message}
			homeHref="/"
			homeLabel="Return to Home Page"
		/>
	);
}
