import React from "react";
import { useRouteError } from "react-router";
import { SharedErrorBoundary } from "~/routes/common/components/ErrorBoundary";

function AdminErrorBoundary() {
	const error = useRouteError();

	// Log the error with full details for debugging
	console.error("[ADMIN ERROR BOUNDARY] Error caught:", error);

	// Check if error is an instance of Error to access message and stack
	if (error instanceof Error) {
		console.error("[ADMIN ERROR BOUNDARY] Error message:", error.message);
		console.error("[ADMIN ERROR BOUNDARY] Error stack:", error.stack);
	}

	// Additional error details if available
	if (typeof error === "object" && error !== null) {
		Object.entries(error).forEach(([key, value]) => {
			console.error(`[ADMIN ERROR BOUNDARY] Error ${key}:`, value);
		});
	}

	let title = "Error";
	let message = "An unexpected error occurred";
	let status = 500;

	if (error instanceof Error) {
		message = error.message;
	} else if (typeof error === "object" && error !== null) {
		status = error.status;
		message = error.data?.message || error.statusText;
		title = `${status} - ${error.statusText}`;
	}

	return (
		<SharedErrorBoundary
			title={title}
			message={message}
			homeHref="/admin"
			homeLabel="Return to Admin Dashboard"
		/>
	);
}

export { AdminErrorBoundary };
export default AdminErrorBoundary;
