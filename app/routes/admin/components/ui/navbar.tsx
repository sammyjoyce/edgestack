'use client'

import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import { LayoutGroup, motion } from 'framer-motion'
import React, { forwardRef, useId } from 'react'
// Assuming TouchTarget and Link are already styled according to openai-fm
import { TouchTarget } from './button' 
import { Link } from './link'

export function Navbar({ className, ...props }: React.ComponentPropsWithoutRef<'nav'>) {
  return <nav {...props} className={clsx(className, 'flex h-14 items-center gap-x-4 px-4 shadow-sm dark:shadow-md bg-white dark:bg-zinc-900')} />
}

export function NavbarDivider({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return <div aria-hidden="true" {...props} className={clsx(className, 'h-5 w-px bg-zinc-300 dark:bg-zinc-700')} />
}

export function NavbarSection({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  let id = useId()

  return (
    <LayoutGroup id={id}>
      <div {...props} className={clsx(className, 'flex items-center gap-x-3')} />
    </LayoutGroup>
  )
}

export function NavbarSpacer({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return <div aria-hidden="true" {...props} className={clsx(className, 'flex-1')} />
}

export const NavbarItem = forwardRef(function NavbarItem(
  {
    current,
    className,
    children,
    ...props
  }: { current?: boolean; className?: string; children: React.ReactNode } & (
    | Omit<Headless.ButtonProps, 'as' | 'className'>
    | Omit<React.ComponentPropsWithoutRef<typeof Link>, 'className'>
  ),
  ref: React.ForwardedRef<HTMLAnchorElement | HTMLButtonElement>
) {
  const itemClasses = clsx(
    'relative flex items-center gap-x-2 rounded-md px-3 py-2 text-sm font-medium outline-none transition-colors',
    current
      ? 'text-primary dark:text-primary-dark bg-primary/10 dark:bg-primary-dark/10'
      : 'text-zinc-700 hover:text-primary hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-primary-dark dark:hover:bg-zinc-800',
    // Icon styling (if any)
    '*:data-[slot=icon]:size-5 *:data-[slot=icon]:fill-current'
  );

  return (
    <span className={clsx(className, 'relative')}>
      {current && (
        <motion.span
          layoutId="current-navbar-indicator" // Ensure unique layoutId if multiple Navbars exist
          className="absolute inset-x-0 -bottom-px h-0.5 bg-primary dark:bg-primary-dark"
        />
      )}
      {'href' in props ? (
        <Link
          {...props}
          className={itemClasses}
          data-current={current ? 'true' : undefined}
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
        >
          <TouchTarget>{children}</TouchTarget>
        </Link>
      ) : (
        <Headless.Button
          {...props}
          className={clsx('cursor-default', itemClasses)} // cursor-default for non-link buttons
          data-current={current ? 'true' : undefined}
          ref={ref}
        >
          <TouchTarget>{children}</TouchTarget>
        </Headless.Button>
      )}
    </span>
  )
});

export function NavbarLabel({ className, ...props }: React.ComponentPropsWithoutRef<'span'>) {
  return <span {...props} className={clsx(className, 'truncate')} />
}
