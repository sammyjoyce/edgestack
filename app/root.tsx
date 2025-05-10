import type React from "react"; 
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
	useMatches,
	useLocation, 
} from "react-router";
import { HashScrollHandler } from "~/routes/common/components/HashScrollHandler"; 
import type { Route } from "./+types/root";
import "./global-error-logger";
import adminThemeStylesheet from "./admin-theme.css?url";
import stylesheet from "./app.css?url";
const darkModeScript = `
  (function() {
    try {
      const theme = localStorage.getItem('theme');
      if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (_) {}
  })();
`;
export const links: Route.LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap",
	},
	{ rel: "stylesheet", href: stylesheet },
];
export default function RootComponent() { 
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<script dangerouslySetInnerHTML={{ __html: darkModeScript }} />
				<Meta />
				<Links />
			</head>
			<body>
				<Outlet /> {}
				<ScrollRestoration />
				<Scripts />
				<HashScrollHandler />
			</body>
		</html>
	);
}
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let title = "Error";
	let message = "An unexpected error occurred.";
	let stack: string | undefined;
	if (isRouteErrorResponse(error)) {
		title = `${error.status} ${error.statusText}`;
		message = typeof error.data === 'string' ? error.data : JSON.stringify(error.data);
	} else if (error instanceof Error) {
		title = error.name || "Error";
		message = error.message;
		stack = error.stack;
	}
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>{title}</title>
				<script dangerouslySetInnerHTML={{ __html: darkModeScript }} />
				<Meta />
				<Links />
			</head>
			<body>
				<h1>{title}</h1>
				<p>{message}</p>
				{stack && (
					<>
						<p>The stack trace is:</p>
						<pre>{stack}</pre>
					</>
				)}
				<Scripts />
			</body>
		</html>
	);
}
