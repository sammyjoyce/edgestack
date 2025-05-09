import clsx from 'clsx'
import React from 'react'; // Added React import

export function Divider({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'hr'>) { // Removed 'soft' prop
  return (
    <hr
      role="presentation"
      {...props}
      className={clsx(
        className,
        'w-full border-t border-zinc-200 dark:border-zinc-700' // Simplified to a single consistent border style
      )}
    />
  )
}
