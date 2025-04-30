import React from "react";
import { useRouteError, isRouteErrorResponse, Link } from "react-router";

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
    <div className="flex items-center justify-center min-h-[75vh] bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-red-600 mb-3">{title}</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex flex-col gap-4">
          <Link
            to="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-center hover:bg-blue-700 transition-colors"
          >
            Return to Home Page
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-center hover:bg-gray-300 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}
