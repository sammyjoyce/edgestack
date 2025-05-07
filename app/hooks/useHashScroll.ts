import { useEffect } from "react";
import { useLocation } from "react-router"; // Using react-router instead of react-router for React Router 7

/**
 * Hook to automatically scroll to an element based on the URL hash
 * Works across page navigations in React Router 7
 */
export function useHashScroll() {
	const { hash } = useLocation();

	useEffect(() => {
		if (hash) {
			const id = hash.slice(1); // Remove the # character
			const element = document.getElementById(id);

			if (element) {
				// Small delay to ensure the page is fully loaded
				setTimeout(() => {
					element.scrollIntoView({ behavior: "smooth" });
				}, 100);
			}
		}
	}, [hash]);
}
