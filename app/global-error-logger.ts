import { logger } from "../utils/logger";

if (typeof window !== "undefined") {
	window.addEventListener("error", (event) => {
		logger.error("Uncaught error", {
			message: event.message,
			error: event.error,
			stack: (event.error as Error | undefined)?.stack,
		});
	});
	window.addEventListener("unhandledrejection", (event) => {
		logger.error("Unhandled rejection", {
			reason: event.reason,
			reasonType: typeof event.reason,
			reasonString: String(event.reason),
		});
	});
}
