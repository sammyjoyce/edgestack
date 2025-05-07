import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * A utility component that handles scrolling to hash fragments when the page loads.
 * This component doesn't render anything visible.
 */
export function HashScrollHandler() {
	const { hash } = useLocation();

	// Use a one-time effect to handle the initial scroll
	useEffect(() => {
		if (hash) {
			// Small delay to ensure the page is fully rendered
			const timeoutId = setTimeout(() => {
				const id = hash.slice(1);
				const element = document.getElementById(id);
				if (element) {
					element.scrollIntoView({ behavior: "smooth" });
				}
			}, 100);

			return () => clearTimeout(timeoutId);
		}
	}, [hash]);

	// This component doesn't render anything
	return null;
}
