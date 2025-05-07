import { useMemo } from "react";
import type { MenuItem } from ".";

interface UseMenuItemInfoResult {
	isRoute: boolean;
	rawPath: string;
	isHomeWithHash: boolean;
	hashPart: string;
	anchorHref: string;
}

export function useMenuItemInfo(item: MenuItem): UseMenuItemInfoResult {
	return useMemo<UseMenuItemInfoResult>(() => {
		const isBrowser = typeof window !== "undefined";
		const isRoute = "isRouteLink" in item && item.isRouteLink === true;
		const rawPath = isRoute && typeof item.path === "string" ? item.path : "";

		const isHomeWithHash =
			isRoute &&
			rawPath.startsWith("/") &&
			rawPath.includes("#") &&
			isBrowser &&
			window.location.pathname === "/";

		const hashPart = isHomeWithHash ? rawPath.split("#")[1] : "";
		const anchorHref =
			!isRoute && typeof item.path === "string" ? item.path : "";

		return { isRoute, rawPath, isHomeWithHash, hashPart, anchorHref };
	}, [item]);
}
