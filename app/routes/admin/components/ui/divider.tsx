import clsx from "clsx";
import type React from "react";

export function Divider({
	className,
	...props
}: React.ComponentPropsWithoutRef<"hr">) {
	return (
		<hr
			{...props}
			className={clsx(className, "w-full border-t border-zinc-200")}
		/>
	);
}
