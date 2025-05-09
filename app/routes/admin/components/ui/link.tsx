/**
 * TODO: Update this component to use your client-side framework's link
 * component. We've provided examples of how to do this for Next.js, Remix, and
 * Inertia.js in the Catalyst documentation:
 *
 * https://catalyst.tailwindui.com/docs#client-side-router-integration
 */

import * as Headless from '@headlessui/react'
import clsx from 'clsx' // Added clsx for conditional class application
import React, { forwardRef } from 'react'

export const Link = forwardRef(function Link(
  props: { href: string; className?: string } & React.ComponentPropsWithoutRef<'a'>, // Added className to props
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  return (
    <Headless.DataInteractive>
      <a
        {...props}
        ref={ref}
        className={clsx(
          props.className, // Preserve existing classes
          'text-primary dark:text-primary-dark', // Basic link color, assuming primary color variables are set in globals.css
          'hover:underline hover:text-primary/80 dark:hover:text-primary-dark/80', // Underline and slightly lighter color on hover
          'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary dark:focus:ring-primary-dark' // Focus ring
        )}
      />
    </Headless.DataInteractive>
  )
})
