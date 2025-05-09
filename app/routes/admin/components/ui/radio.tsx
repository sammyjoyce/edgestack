import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import React from 'react' // Added React import

export function RadioGroup({
  className,
  ...props
}: { className?: string } & Omit<Headless.RadioGroupProps, 'as' | 'className'>) {
  return (
    <Headless.RadioGroup
      {...props}
      className={clsx(
        className,
        'space-y-3'
      )}
    />
  )
}

export function RadioField({
  className,
  ...props
}: { className?: string } & Omit<Headless.FieldProps, 'as' | 'className'>) {
  return (
    <Headless.Field
      {...props}
      className={clsx(
        className,
        'flex items-center gap-x-3'
      )}
    />
  )
}

export function Radio({
  className,
  ...props
}: { className?: string } & Omit<Headless.RadioProps, 'as' | 'className' | 'children'>) {
  return (
    <Headless.Radio
      {...props}
      className={clsx(
        className,
        'group flex size-5 items-center justify-center rounded-full border bg-white dark:bg-zinc-900',
        'border-zinc-300 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-600',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-primary-dark dark:ring-offset-zinc-900',
        'data-[checked]:border-primary data-[checked]:hover:border-primary-hover dark:data-[checked]:border-primary-dark dark:data-[checked]:hover:border-primary-dark-hover',
        'data-[disabled]:opacity-50 data-[disabled]:pointer-events-none'
      )}
    >
      <span
        className={clsx(
          'size-2 rounded-full bg-transparent',
          'group-data-[checked]:bg-primary dark:group-data-[checked]:bg-primary-dark'
        )}
      />
    </Headless.Radio>
  )
}

// Add Label, Description, ErrorMessage components if needed, similar to Fieldset
export function Label({ className, ...props }: React.ComponentPropsWithoutRef<'label'>) {
  return <Headless.Label {...props} data-slot="label" className={clsx(className, 'text-sm font-medium text-zinc-900 dark:text-white')} />
}

export function Description({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return <Headless.Description {...props} data-slot="description" className={clsx(className, 'text-sm text-zinc-600 dark:text-zinc-400')} />
}

export function ErrorMessage({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
    return <Headless.Description {...props} data-slot="error" className={clsx(className, 'text-sm text-red-600 dark:text-red-500')} />
}
