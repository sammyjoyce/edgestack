export type LogLevel = "debug" | "info" | "warn" | "error";
export interface LogContext {
        [key: string]: unknown;
}

function emit(level: LogLevel, message: string, context?: LogContext) {
        const entry = {
                timestamp: new Date().toISOString(),
                level,
                message,
                ...context,
        };
        const json = JSON.stringify(entry);
        switch (level) {
                case "error":
                        console.error(json);
                        break;
                case "warn":
                        console.warn(json);
                        break;
                default:
                        console.log(json);
        }
}

export const logger = {
        debug(message: string, context?: LogContext) {
                if (process.env.NODE_ENV !== "production") {
                        emit("debug", message, context);
                }
        },
        info(message: string, context?: LogContext) {
                emit("info", message, context);
        },
        warn(message: string, context?: LogContext) {
                emit("warn", message, context);
        },
        error(message: string, context?: LogContext) {
                emit("error", message, context);
        },
};

export function logError(message: string, error: unknown, context?: LogContext) {
        const base: LogContext = context ? { ...context } : {};
        if (error instanceof Error) {
                base.error = error.message;
                base.stack = error.stack;
        } else {
                base.error = error;
        }
        logger.error(message, base);
}
