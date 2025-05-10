import { useEffect } from "react";
import { useLocation } from "react-router"; 
export function useHashScroll() {
	const { hash } = useLocation();
	useEffect(() => {
		if (hash) {
			const id = hash.slice(1); 
			const element = document.getElementById(id);
			if (element) {
				setTimeout(() => {
					element.scrollIntoView({ behavior: "smooth" });
				}, 100);
			}
		}
	}, [hash]);
}
