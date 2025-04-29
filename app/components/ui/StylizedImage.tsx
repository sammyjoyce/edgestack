import clsx from "@common/utils/clsx";
import { useId } from "react";

const shapes = [
  {
    width: 655,
    height: 680,
    path: "M50 100 L605 100 L585 580 L30 580 Z",
  },
  {
    width: 719,
    height: 680,
    path: "M50 100 L669 100 L649 580 L30 580 Z",
  },
  {
    width: 719,
    height: 680,
    path: "M60 120 L659 120 L639 560 L40 560 Z",
  },
];

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement>;
type ImagePropsWithOptionalAlt = Omit<ImageProps, "alt"> & { alt?: string };

export function StylizedImage({
  shape = 0,
  className,
  width: propWidth,
  height: propHeight,
  src,
  alt = "",
  ...props
}: ImagePropsWithOptionalAlt & { shape?: 0 | 1 | 2 }) {
  const id = useId();
  const { width, height, path } = shapes[shape];

  return (
    <div
      className={clsx(
        className,
        "relative flex aspect-719/680 w-full grayscale"
      )}
    >
      <svg viewBox={`0 0 ${width} ${height}`} fill="none" className="h-full">
        <g clipPath={`url(#${id}-clip)`} className="group">
          <g className="origin-center scale-100 transition duration-500 motion-safe:group-hover:scale-105">
            <foreignObject width={width} height={height}>
              <img
                src={src}
                alt={alt}
                className="w-full bg-neutral-100 object-cover"
                style={{ aspectRatio: `${width} / ${height}` }}
                {...props}
              />
            </foreignObject>
          </g>
          <use
            href={`#${id}-shape`}
            strokeWidth="2"
            className="stroke-neutral-950/10"
          />
        </g>
        <defs>
          <clipPath id={`${id}-clip`}>
            <path
              id={`${id}-shape`}
              d={path}
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}
