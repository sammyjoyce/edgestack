import clsx from "clsx";
import type React from "react"; // Added React import

export function Divider({
	className,
	...props
}: React.ComponentPropsWithoutRef<"hr">) {
	// Removed 'soft' prop
	return (
		<hr
			{...props}
			className={clsx(
				className,
				"w-full border-t border-zinc-200 dark:border-zinc-700", // Simplified to a single consistent border style
			)}
		/>
	);
}
