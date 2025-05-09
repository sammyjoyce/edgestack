import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import type React from 'react'

export function Fieldset({
  className,
  ...props
}: { className?: string } & Omit<Headless.FieldsetProps, 'as' | 'className'>) {
  return (
    <Headless.Fieldset
      {...props}
      // Simplified Fieldset styling: basic border and padding, with space for children.
      className={clsx(className, 'space-y-6 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4')}
    />
  )
}

export function Legend({
  className,
  ...props
}: { className?: string } & Omit<Headless.LegendProps, 'as' | 'className'>) {
  return (
    <Headless.Legend
      data-slot="legend"
      {...props}
      // Simplified Legend styling: standard text size and weight.
      className={clsx(
        className,
        'text-base font-semibold text-zinc-900 dark:text-white data-disabled:opacity-50'
      )}
    />
  )
}

export function FieldGroup({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  // Simplified FieldGroup: provides spacing between groups of fields.
  return <div data-slot="control" {...props} className={clsx(className, 'space-y-4')} />
}

export function Field({ className, ...props }: { className?: string } & Omit<Headless.FieldProps, 'as' | 'className'>) {
  return (
    <Headless.Field
      {...props}
      // Simplified Field styling: manages spacing between label, control, description, and error.
      className={clsx(
        className,
        'flex flex-col gap-1.5' // Use gap for consistent spacing
      )}
    />
  )
}

export function Label({ className, ...props }: { className?: string } & Omit<Headless.LabelProps, 'as' | 'className'>) {
  return (
    <Headless.Label
      data-slot="label"
      {...props}
      // Simplified Label styling: standard text size and weight.
      className={clsx(
        className,
        'text-sm font-medium text-zinc-900 dark:text-white select-none data-disabled:opacity-50'
      )}
    />
  )
}

export function Description({
  className,
  ...props
}: { className?: string } & Omit<Headless.DescriptionProps, 'as' | 'className'>) {
  return (
    <Headless.Description
      data-slot="description"
      {...props}
      // Simplified Description styling: smaller text size and muted color.
      className={clsx(className, 'text-sm text-zinc-500 dark:text-zinc-400 data-disabled:opacity-50')}
    />
  )
}

export function ErrorMessage({
  className,
  ...props
}: { className?: string } & Omit<Headless.DescriptionProps, 'as' | 'className'>) {
  return (
    <Headless.Description
      data-slot="error"
      {...props}
      // Simplified ErrorMessage styling: standard error color and text size.
      className={clsx(className, 'text-sm text-red-600 dark:text-red-500 data-disabled:opacity-50')}
    />
  )
}
