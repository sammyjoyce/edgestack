'use client'

import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import { useState } from 'react'

export function Combobox<T>({
  options,
  displayValue,
  filter,
  anchor = 'bottom',
  className,
  placeholder,
  autoFocus,
  'aria-label': ariaLabel,
  children,
  ...props
}: {
  options: T[]
  displayValue: (value: T | null) => string | undefined
  filter?: (value: T, query: string) => boolean
  className?: string
  placeholder?: string
  autoFocus?: boolean
  'aria-label'?: string
  children: (value: NonNullable<T>) => React.ReactElement
} & Omit<Headless.ComboboxProps<T, false>, 'as' | 'multiple' | 'children'> & { anchor?: 'top' | 'bottom' }) {
  const [query, setQuery] = useState('')

  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) =>
          filter ? filter(option, query) : displayValue(option)?.toLowerCase().includes(query.toLowerCase())
        )

  return (
    <Headless.Combobox {...props} multiple={false} virtual={{ options: filteredOptions }} onClose={() => setQuery('')}>
      <div // Changed from span to div for semantic correctness and to avoid complex pseudo-elements for styling
        data-slot="control-wrapper" // Added for clarity
        className={clsx(
          'relative w-full',
          // Focus ring applied to the wrapper for better visual consistency
          'focus-within:ring-2 focus-within:ring-primary dark:focus-within:ring-primary-dark focus-within:ring-offset-0 rounded-lg',
          // Disabled state
          'has-[[data-disabled]]:opacity-70 has-[[data-disabled]]:cursor-not-allowed'
        )}
      >
        <Headless.ComboboxInput
          autoFocus={autoFocus}
          data-slot="control"
          aria-label={ariaLabel}
          displayValue={(option: T) => displayValue(option) ?? ''}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          className={clsx(
            className, // Allow external classes
            // Basic layout & Sizing
            'relative block w-full appearance-none rounded-lg px-3.5 py-2.5 sm:px-3 sm:py-1.5',
            // Typography
            'text-base text-zinc-950 placeholder:text-zinc-500 sm:text-sm dark:text-white dark:placeholder:text-zinc-400',
            // Borders
            'border border-zinc-300 hover:border-zinc-400 dark:border-zinc-600 dark:hover:border-zinc-500',
            // Background
            'bg-white dark:bg-zinc-800',
            // Focus: Handled by the wrapper, but ensure no default outline
            'focus:outline-none',
            // Invalid state
            'data-[invalid]:border-red-500 data-[invalid]:hover:border-red-500 dark:data-[invalid]:border-red-500 dark:data-[invalid]:hover:border-red-500',
            // Disabled state
            'data-[disabled]:border-zinc-300 data-[disabled]:bg-zinc-100 data-[disabled]:text-zinc-400 dark:data-[disabled]:border-zinc-700 dark:data-[disabled]:bg-zinc-800 dark:data-[disabled]:text-zinc-500',
            'dark:scheme-dark'
          )}
        />
        <Headless.ComboboxButton className="group absolute inset-y-0 right-0 flex items-center px-2.5">
          <svg
            className="size-5 stroke-zinc-500 group-data-[disabled]:stroke-zinc-400 group-hover:stroke-zinc-700 sm:size-4 dark:stroke-zinc-400 dark:group-hover:stroke-zinc-300 dark:group-data-[disabled]:stroke-zinc-500"
            viewBox="0 0 16 16"
            aria-hidden="true"
            fill="none"
          >
            <path d="M5.75 10.75L8 13L10.25 10.75" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10.25 5.25L8 3L5.75 5.25" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Headless.ComboboxButton>
      </div>
      <Headless.ComboboxOptions
        transition
        anchor={anchor}
        className={clsx(
          'isolate z-10 mt-1 min-w-[calc(var(--input-width)+8px)] scroll-py-1 rounded-lg p-1 select-none empty:invisible',
          'max-h-60 overflow-y-auto overscroll-contain',
          'bg-white dark:bg-zinc-800',
          'shadow-lg ring-1 ring-zinc-950/5 dark:ring-white/10',
          'transition-opacity duration-100 ease-in data-[closed]:opacity-0 data-[transition]:pointer-events-none'
        )}
      >
        {({ option }) => children(option)}
      </Headless.ComboboxOptions>
    </Headless.Combobox>
  )
}

export function ComboboxOption<T>({
  children,
  className,
  ...props
}: { className?: string; children?: React.ReactNode } & Omit<
  Headless.ComboboxOptionProps<'div', T>,
  'as' | 'className'
>) {
  let sharedClasses = clsx(
    'flex min-w-0 items-center gap-x-2',
    '*:data-[slot=icon]:size-5 *:data-[slot=icon]:shrink-0 sm:*:data-[slot=icon]:size-4',
    '*:data-[slot=icon]:text-zinc-500 group-data-[focus]:*:data-[slot=icon]:text-white dark:*:data-[slot=icon]:text-zinc-400',
    '*:data-[slot=avatar]:-mx-0.5 *:data-[slot=avatar]:size-6 sm:*:data-[slot=avatar]:size-5'
  )

  return (
    <Headless.ComboboxOption
      {...props}
      className={clsx(
        'group/option flex w-full cursor-default items-center justify-between rounded-md py-2 px-2.5 sm:py-1.5 sm:px-2',
        'text-base text-zinc-900 sm:text-sm dark:text-white',
        // Focus/Active state
        'data-[focus]:bg-primary data-[focus]:text-white dark:data-[focus]:bg-primary-dark',
        // Selected state (check mark)
        'data-[selected]:font-semibold',
        'data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed'
      )}
    >
      <span className={clsx(className, sharedClasses)}>{children}</span>
      <svg
        className="relative hidden size-5 self-center stroke-current group-data-[selected]:inline sm:size-4"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path d="M4 8.5l3 3L12 4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Headless.ComboboxOption>
  )
}

export function ComboboxLabel({ className, ...props }: React.ComponentPropsWithoutRef<'span'>) {
  return <span {...props} className={clsx(className, 'truncate')} />
}

export function ComboboxDescription({ className, children, ...props }: React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      {...props}
      className={clsx(
        className,
        'text-sm text-zinc-500 group-data-[focus]:text-primary-100 dark:text-zinc-400 dark:group-data-[focus]:text-primary-dark-100 truncate'
      )}
    >
      {children}
    </span>
  )
}
