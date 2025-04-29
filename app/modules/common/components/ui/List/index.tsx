import clsx from "clsx"; // Use direct import
import React from "react"; // Import React

import { Border } from "~/modules/common/components/ui/Border"; // Corrected path
import { FadeIn, FadeInStagger } from "~/modules/common/components/ui/FadeIn"; // Corrected path

export function List({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <FadeInStagger>
      <ul role="list" className={clsx("text-base text-neutral-600", className)}>
        {children}
      </ul>
    </FadeInStagger>
  );
}

export function ListItem({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <li className="group mt-10 first:mt-0">
      <FadeIn>
        <Border className="pt-10 group-first:pt-0 group-first:before:hidden group-first:after:hidden">
          {title && (
            <strong className="font-semibold text-neutral-950">{`${title}. `}</strong>
          )}
          {children}
        </Border>
      </FadeIn>
    </li>
  );
}
