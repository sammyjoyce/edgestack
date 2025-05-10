import clsx from "clsx";
import {
	motion,
	useMotionTemplate,
	useScroll,
	useTransform,
} from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import type React from "react";
import { useRef } from "react";
const MotionImage = motion.img;
interface GrayscaleTransitionImageProps {
	className?: string;
	alt?: string;
	src?: string;
	width?: number | string;
	height?: number | string;
	loading?: "eager" | "lazy";
	decoding?: "sync" | "async" | "auto";
	id?: string;
	sizes?: string;
	srcSet?: string;
	[key: string]: any;
}
export function GrayscaleTransitionImage({
	className,
	alt = "",
	src,
	width,
	height,
	loading = "lazy",
	decoding = "async",
	...rest
}: GrayscaleTransitionImageProps) {
	const ref = useRef<React.ElementRef<"div">>(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start 65%", "end 35%"],
	});
	const grayscale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0, 1]);
	const filter = useMotionTemplate`grayscale(${grayscale})`;
	const imgProps = {
		src,
		alt,
		width,
		height,
		className: "absolute inset-0 h-full w-full object-cover",
		loading,
		decoding,
		onDrag: undefined,
		onDragEnd: undefined,
		onDragStart: undefined,
	};
	return (
		<div ref={ref} className={clsx("group relative", className)}>
			<MotionImage
				src={src}
				alt={alt}
				width={width}
				height={height}
				className="absolute inset-0 h-full w-full object-cover"
				loading={loading}
				decoding={decoding}
				style={{ filter }}
				{...rest}
			/>
			<div
				className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
				aria-hidden="true"
			>
				<img {...imgProps} />
			</div>
		</div>
	);
}
