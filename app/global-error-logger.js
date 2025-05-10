// This file adds a global error and unhandledrejection logger for client-side diagnostics
if (typeof window !== "undefined") {
	window.addEventListener("error", (event) => {
		console.error("[GlobalError] Uncaught error:", {
			message: event.message,
			error: event.error,
			stack: event.error?.stack,
			event,
		});
	});
	window.addEventListener("unhandledrejection", (event) => {
		console.error("[GlobalError] Unhandled rejection:", {
			reason: event.reason,
			reasonType: typeof event.reason,
			reasonString: String(event.reason),
			reasonJson: (() => {
				try {
					return JSON.stringify(event.reason);
				} catch {
					return null;
				}
			})(),
			event,
		});
	});
}
