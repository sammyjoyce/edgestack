/**
 * Updated to use React Router's Link component for client-side navigation.
 * Reference: https://catalyst.tailwindui.com/docs#client-side-router-integration
 */

import * as Headless from '@headlessui/react'
import clsx from 'clsx'
import React, { forwardRef } from 'react'
import { Link as RouterLink } from 'react-router'

export const Link = forwardRef(function Link(
  props: { href: string; className?: string } & React.ComponentPropsWithoutRef<typeof RouterLink>,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  return (
    <Headless.DataInteractive>
      <RouterLink
        {...props}
        to={props.href}
        ref={ref}
        className={clsx(
          props.className,
          'text-primary dark:text-primary-dark',
          'hover:underline hover:text-primary/80 dark:hover:text-primary-dark/80',
          'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary dark:focus:ring-primary-dark'
        )}
      />
    </Headless.DataInteractive>
  )
})
