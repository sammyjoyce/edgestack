import clsx from "clsx";
import { forwardRef } from "react";
import type { ForwardedRef, ReactNode } from "react";
import { Link, type LinkProps } from "react-router";

// Simplified Button props - covers all the different use cases
type ButtonProps = {
  invert?: boolean;
  className?: string;
  children?: ReactNode;
  // For Link component
  to?: string;
  // For anchor element
  href?: string;
  // For polymorphic rendering
  as?: any;
  // Allow any other props
  [key: string]: any;
};

// Much simpler implementation with clearer rendering logic
export const Button = forwardRef(function Button(
  { invert = false, className, children, as, to, href, ...props }: ButtonProps,
  ref: ForwardedRef<HTMLElement>
) {
  className = clsx(
    className,
    "inline-flex rounded-full px-4 py-1.5 text-sm font-semibold transition",
    invert
      ? "bg-white text-neutral-950 hover:bg-neutral-200"
      : "bg-neutral-950 text-white hover:bg-neutral-800"
  );

  const inner = <span className="relative top-px">{children}</span>;

  // React Router Link (highest priority)
  if (to !== undefined) {
    return (
      <Link to={to} className={className} {...props}>
        {inner}
      </Link>
    );
  }

  // HTML anchor
  if (href !== undefined || as === "a") {
    return (
      <a
        ref={ref as ForwardedRef<HTMLAnchorElement>}
        href={href}
        className={className}
        {...props}
      >
        {inner}
      </a>
    );
  }

  // Custom component
  if (as && typeof as !== "string") {
    const Component = as;
    return (
      <Component ref={ref} className={className} {...props}>
        {inner}
      </Component>
    );
  }

  // Default button
  return (
    <button
      ref={ref as ForwardedRef<HTMLButtonElement>}
      className={className}
      {...props}
    >
      {inner}
    </button>
  );
});
