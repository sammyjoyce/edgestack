import clsx from "clsx";
import React from "react"; 
export function Divider({
	className,
	...props
}: React.ComponentPropsWithoutRef<"hr">) {
	return (
		<hr
			{...props}
			className={clsx(
				className,
				"w-full border-t border-zinc-200 dark:border-zinc-700", 
			)}
		/>
	);
}
