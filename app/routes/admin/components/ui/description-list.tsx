import clsx from 'clsx'
import React from 'react'; // Added React import for React.ComponentPropsWithoutRef

export function DescriptionList({ className, ...props }: React.ComponentPropsWithoutRef<'dl'>) {
  return (
    <dl
      {...props}
      className={clsx(
        className,
        'grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3',
        'text-sm'
      )}
    />
  )
}

export function DescriptionTerm({ className, ...props }: React.ComponentPropsWithoutRef<'dt'>) {
  return (
    <dt
      {...props}
      className={clsx(
        className,
        'font-medium text-zinc-900 dark:text-white sm:col-span-1',
        // Adding padding and border for separation, similar to other list-like structures
        'pt-2 pb-1 border-b border-zinc-200 dark:border-zinc-700 first:pt-0 first:border-t-0 sm:border-b-0 sm:pb-0'
      )}
    />
  )
}

export function DescriptionDetails({ className, ...props }: React.ComponentPropsWithoutRef<'dd'>) {
  return (
    <dd
      {...props}
      className={clsx(
        className,
        'text-zinc-700 dark:text-zinc-300 sm:col-span-2',
        // Matching padding and border for alignment with DescriptionTerm
        'pt-1 pb-2 border-b border-zinc-200 dark:border-zinc-700 sm:border-b-0 sm:pt-2 sm:pb-0'
      )}
    />
  )
}
