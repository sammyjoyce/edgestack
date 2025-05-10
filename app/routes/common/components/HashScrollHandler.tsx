import { useEffect } from "react";
import { useLocation } from "react-router";
export function HashScrollHandler() {
	const { hash } = useLocation();
	useEffect(() => {
		if (hash) {
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
	return null;
}
