import React from "react";
import { useRouteError, isRouteErrorResponse } from "react-router";
import { SharedErrorBoundary } from "~/routes/common/components/ErrorBoundary";
function AdminErrorBoundary() {
	const error = useRouteError();
	console.error("[ADMIN ERROR BOUNDARY] Error caught:", error);
	let title = "Error";
	let message = "An unexpected error occurred";
	let status = 500;
	if (isRouteErrorResponse(error)) {
		status = error.status;
		title = `${error.status} - ${error.statusText}`;
		if (
			error.data &&
			typeof error.data === "object" &&
			"message" in error.data &&
			typeof error.data.message === "string"
		) {
			message = error.data.message;
		} else if (typeof error.data === "string" && error.data.length > 0) {
			message = error.data;
		} else {
			message = error.statusText || "An error occurred";
		}
	} else if (error instanceof Error) {
		message = error.message;
	}
	if (error instanceof Error) {
		console.error("[ADMIN ERROR BOUNDARY] Error message:", error.message);
		console.error("[ADMIN ERROR BOUNDARY] Error stack:", error.stack);
	}
	if (
		typeof error === "object" &&
		error !== null &&
		!isRouteErrorResponse(error) &&
		!(error instanceof Error)
	) {
		Object.entries(error).forEach(([key, value]) => {
			console.error(`[ADMIN ERROR BOUNDARY] Error ${key}:`, value);
		});
	}
	return (
		<SharedErrorBoundary
			title={title}
			message={message}
			status={status}
			homeHref="/admin"
			homeLabel="Return to Admin Dashboard"
		/>
	);
}
export { AdminErrorBoundary };
export default AdminErrorBoundary;
