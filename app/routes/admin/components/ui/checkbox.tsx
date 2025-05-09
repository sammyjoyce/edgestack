import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import type React from 'react'

export function CheckboxGroup({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      data-slot="control"
      {...props}
      className={clsx(
        className,
        // Basic groups
        'space-y-3',
        // With descriptions
        'has-data-[slot=description]:space-y-6 has-data-[slot=description]:**:data-[slot=label]:font-medium'
      )}
    />
  )
}

export function CheckboxField({
  className,
  ...props
}: { className?: string } & Omit<Headless.FieldProps, 'as' | 'className'>) {
  return (
    <Headless.Field
      data-slot="field"
      {...props}
      className={clsx(
        className,
        // Base layout
        'grid grid-cols-[1.125rem_1fr] gap-x-4 gap-y-1 sm:grid-cols-[1rem_1fr]',
        // Control layout
        '*:data-[slot=control]:col-start-1 *:data-[slot=control]:row-start-1 *:data-[slot=control]:mt-0.75 sm:*:data-[slot=control]:mt-1',
        // Label layout
        '*:data-[slot=label]:col-start-2 *:data-[slot=label]:row-start-1',
        // Description layout
        '*:data-[slot=description]:col-start-2 *:data-[slot=description]:row-start-2',
        // With description
        'has-data-[slot=description]:**:data-[slot=label]:font-medium'
      )}
    />
  )
}

// Simplified base styles for checkbox, aiming for openai-fm look and feel
const baseStyles = [
  'relative isolate flex size-4 items-center justify-center rounded-sm',
  'border border-zinc-300 dark:border-zinc-700',
  'bg-white dark:bg-zinc-900',
  // Checked state
  'group-data-checked:bg-primary group-data-checked:border-primary',
  // Focus ring
  'group-data-focus:outline-2 group-data-focus:outline-offset-2 group-data-focus:outline-blue-500',
  // Disabled state
  'group-data-disabled:opacity-50 group-data-disabled:cursor-not-allowed',
  'group-data-disabled:border-zinc-400 dark:group-data-disabled:border-zinc-600',
  'group-data-disabled:bg-zinc-100 dark:group-data-disabled:bg-zinc-800',
  'group-data-checked:group-data-disabled:bg-primary/50 group-data-checked:group-data-disabled:border-primary/50',
];

// Removed complex color variables and pseudo-elements, relying on direct Tailwind classes and global vars.
// Color prop is simplified or removed if openai-fm checkboxes don't have color variants.
// Assuming a single primary color for checked state from globals.css.

export function Checkbox({
  className,
  // color prop might be removed or simplified based on openai-fm's checkbox design
  // For now, let's assume no color variants beyond the default checked state.
  ...props
}: {
  className?: string
} & Omit<Headless.CheckboxProps, 'as' | 'className'>) {
  return (
    <Headless.Checkbox
      data-slot="control"
      {...props}
      className={clsx(className, 'group inline-flex focus:outline-hidden')}
    >
      <span className={clsx(baseStyles)}>
        <svg
          className="size-3.5 stroke-white opacity-0 group-data-checked:opacity-100 group-data-disabled:stroke-zinc-400 dark:group-data-disabled:stroke-zinc-500"
          viewBox="0 0 14 14"
          fill="none"
        >
          {/* Checkmark icon */}
          <path
            className="opacity-100 group-data-indeterminate:opacity-0"
            d="M3 8L6 11L11 3.5"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Indeterminate icon */}
          <path
            className="opacity-0 group-data-indeterminate:opacity-100"
            d="M3 7H11"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Headless.Checkbox>
  )
}
