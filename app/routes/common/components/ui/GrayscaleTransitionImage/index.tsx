import clsx from "clsx"; // Use direct import
import {
	motion,
	useMotionTemplate,
	useScroll,
	useTransform,
} from "framer-motion"; // Use direct import
import type { HTMLMotionProps } from "framer-motion";
import type React from "react";
import { useRef } from "react";

const MotionImage = motion.img;

// Define a more compatible props interface that works with both HTML and Motion props
interface GrayscaleTransitionImageProps {
	className?: string; // For the wrapper div
	alt?: string;
	src?: string;
	width?: number | string;
	height?: number | string;
	loading?: "eager" | "lazy";
	decoding?: "sync" | "async" | "auto";
	id?: string;
	sizes?: string;
	srcSet?: string;
	[key: string]: any; // Allow other props but don't enforce type checking on them
}

export function GrayscaleTransitionImage({
	className,
	alt = "",
	src,
	width,
	height,
	loading = "lazy",
	decoding = "async",
	...rest // Capture remaining props
}: GrayscaleTransitionImageProps) {
	const ref = useRef<React.ElementRef<"div">>(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start 65%", "end 35%"],
	});
	const grayscale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0, 1]);
	const filter = useMotionTemplate`grayscale(${grayscale})`;

	// Define props specifically for the underlying img elements
	// Only include explicitly supported standard img attributes
	const imgProps = {
		src,
		alt,
		width,
		height,
		className: "absolute inset-0 h-full w-full object-cover",
		loading,
		decoding,
		// Exclude event handlers from regular img element
		onDrag: undefined,
		onDragEnd: undefined,
		onDragStart: undefined,
	};

	return (
		// Apply passed className to the wrapper div
		<div ref={ref} className={clsx("group relative", className)}>
			<MotionImage
				src={src}
				alt={alt}
				width={width}
				height={height}
				className="absolute inset-0 h-full w-full object-cover"
				loading={loading}
				decoding={decoding}
				style={{ filter }} // Type-safe without 'as any'
				{...rest} // Spread remaining props
			/>
			{/* Static image for hover effect */}
			<div
				className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
				aria-hidden="true"
			>
				{/* Use the same controlled props for the static image */}
				<img {...imgProps} />
			</div>
		</div>
	);
}
