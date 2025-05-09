import clsx from 'clsx'
import React from 'react' // Added React import
import { Button } from './button' // Assuming Button is styled

const ChevronLeftIcon = () => (
  <svg className="size-4 stroke-current" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M10.25 12.75L5.75 8L10.25 3.25" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="size-4 stroke-current" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M5.75 3.25L10.25 8L5.75 12.75" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function Pagination({
  'aria-label': ariaLabel = 'Page navigation',
  className,
  ...props
}: React.ComponentPropsWithoutRef<'nav'>) {
  return <nav aria-label={ariaLabel} {...props} className={clsx(className, 'flex items-center justify-center gap-x-1 sm:gap-x-2')} />
}

export function PaginationPrevious({
  href = null,
  className,
  children = 'Previous',
}: React.PropsWithChildren<{ href?: string | null; className?: string }>) {
  return (
    <Button
      href={href === null ? undefined : href}
      disabled={href === null}
      variant="ghost" // Use a ghost or plain variant for pagination buttons
      aria-label="Previous page"
      className={clsx(className, 'gap-x-1 pr-2.5')}
    >
      <ChevronLeftIcon />
      {children}
    </Button>
  )
}

export function PaginationNext({
  href = null,
  className,
  children = 'Next',
}: React.PropsWithChildren<{ href?: string | null; className?: string }>) {
  return (
    <Button
      href={href === null ? undefined : href}
      disabled={href === null}
      variant="ghost"
      aria-label="Next page"
      className={clsx(className, 'gap-x-1 pl-2.5')}
    >
      {children}
      <ChevronRightIcon />
    </Button>
  )
}

export function PaginationList({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  return <div {...props} className={clsx(className, 'hidden items-center gap-x-1 sm:flex')} />
}

export function PaginationPage({
  href,
  className,
  current = false,
  children,
}: React.PropsWithChildren<{ href: string; className?: string; current?: boolean }>) {
  return (
    <Button
      href={href}
      variant={current ? 'outline' : 'ghost'} // Active page has outline, others are ghost
      aria-label={`Page ${children}`}
      aria-current={current ? 'page' : undefined}
      className={clsx(
        className,
        'min-w-[2.25rem] px-2.5 py-1.5 text-sm',
        current && 'font-semibold ring-1 ring-primary dark:ring-primary-dark text-primary dark:text-primary-dark',
        !current && 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
      )}
    >
      {children}
    </Button>
  )
}

export function PaginationGap({
  className,
  children = <>&hellip;</>,
  ...props
}: React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      aria-hidden="true"
      {...props}
      className={clsx(
        className,
        'flex h-9 w-9 items-center justify-center text-sm font-medium text-zinc-600 dark:text-zinc-400 select-none'
      )}
    >
      {children}
    </span>
  )
}
