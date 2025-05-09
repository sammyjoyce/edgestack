import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import React, { forwardRef } from 'react'

export function InputGroup({ children }: React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      data-slot="control"
      className={clsx(
        'relative isolate block',
        // Adjust padding for icons to match openai-fm if applicable, or simplify
        'has-[[data-slot=icon]:first-child]:[&_input]:pl-10 has-[[data-slot=icon]:last-child]:[&_input]:pr-10',
        '*:data-[slot=icon]:pointer-events-none *:data-[slot=icon]:absolute *:data-[slot=icon]:top-1/2 *:data-[slot=icon]:-translate-y-1/2 *:data-[slot=icon]:z-10 *:data-[slot=icon]:size-5',
        '[&>[data-slot=icon]:first-child]:left-3 [&>[data-slot=icon]:last-child]:right-3',
        '*:data-[slot=icon]:text-zinc-500 dark:*:data-[slot=icon]:text-zinc-400'
      )}
    >
      {children}
    </span>
  )
}

const dateTypes = ['date', 'datetime-local', 'month', 'time', 'week']
type DateType = (typeof dateTypes)[number]

export const Input = forwardRef(function Input(
  {
    className,
    ...props
  }: {
    className?: string
    type?: 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url' | DateType
  } & Omit<Headless.InputProps, 'as' | 'className'>,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  // Removed the outer span with complex pseudo-elements for background/shadow.
  // Direct styling will be applied to Headless.Input.
  return (
    <Headless.Input
      ref={ref}
      {...props}
      className={clsx([
        className,
        // Date classes (kept as is, assuming they are standard and not openai-fm specific)
        props.type &&
          dateTypes.includes(props.type) && [
            '[&::-webkit-datetime-edit-fields-wrapper]:p-0',
            '[&::-webkit-date-and-time-value]:min-h-[1.5em]',
            '[&::-webkit-datetime-edit]:inline-flex',
            '[&::-webkit-datetime-edit]:p-0',
            '[&::-webkit-datetime-edit-year-field]:p-0',
            '[&::-webkit-datetime-edit-month-field]:p-0',
            '[&::-webkit-datetime-edit-day-field]:p-0',
            '[&::-webkit-datetime-edit-hour-field]:p-0',
            '[&::-webkit-datetime-edit-minute-field]:p-0',
            '[&::-webkit-datetime-edit-second-field]:p-0',
            '[&::-webkit-datetime-edit-millisecond-field]:p-0',
            '[&::-webkit-datetime-edit-meridiem-field]:p-0',
          ],
        // Basic layout and appearance from openai-fm (conceptual)
        'relative block w-full appearance-none rounded-md px-3 py-2 sm:text-sm',
        // Typography (using global vars or direct Tailwind)
        'text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-500',
        // Border (simplified, using global vars or direct Tailwind)
        'border border-zinc-300 dark:border-zinc-700',
        // Background color (using global vars or direct Tailwind)
        'bg-background dark:bg-zinc-800',
        // Focus state (simplified, using global vars or direct Tailwind)
        'focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-primary dark:focus:ring-primary-dark',
        // Invalid state (simplified)
        'data-invalid:border-red-500 data-invalid:ring-red-500 dark:data-invalid:border-red-600 dark:data-invalid:ring-red-600',
        // Disabled state (simplified)
        'data-disabled:opacity-50 data-disabled:cursor-not-allowed',
        'data-disabled:border-zinc-300 dark:data-disabled:border-zinc-700',
        'data-disabled:bg-zinc-100 dark:data-disabled:bg-zinc-800/50',
        // System icons
        'dark:scheme-dark',
      ])}
    />
  )
})
