import clsx from "clsx"; // Use direct import
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion"; // Use direct import
import type React from "react";
import { useRef } from "react";

const MotionImage = motion.img;

// Define props based on standard img attributes we want to support
interface GrayscaleTransitionImageProps
  extends Omit<
    React.ImgHTMLAttributes<HTMLImageElement>,
    "style" | "className" // Exclude style (handled by motion) and className (handled by wrapper)
  > {
  className?: string; // Allow className for the wrapper div
  alt?: string;
}

export function GrayscaleTransitionImage({
  className,
  alt = "",
  src,
  width,
  height,
  loading = "lazy",
  decoding = "async",
  // Explicitly ignore other props to avoid type conflicts with motion.img
  ..._ignoredRest
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
  };

  return (
    // Apply passed className to the wrapper div
    <div ref={ref} className={clsx("group relative", className)}>
      <MotionImage
        {...imgProps} // Spread defined, compatible img props
        style={{ filter } as any} // Apply motion style
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
