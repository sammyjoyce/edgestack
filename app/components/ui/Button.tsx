import { Link, type LinkProps } from 'react-router'
import clsx from 'clsx'

// Props for react-router Link, omitting className
type RouterLinkProps = Omit<LinkProps, 'className'> & { to: LinkProps['to'] };

// Props for HTML button, omitting className
type HtmlButtonProps = Omit<React.ComponentPropsWithoutRef<'button'>, 'className'>;

type ButtonProps = {
  invert?: boolean
  className?: string
  children?: React.ReactNode
} & (
    // Render as react-router Link (requires 'to')
    RouterLinkProps & { href?: never } |
    // Render as standard button (cannot have 'to' or 'href')
    HtmlButtonProps & { to?: never; href?: never }
  )

export function Button({
  invert = false,
  className,
  children,
  ...props
}: ButtonProps) {
  className = clsx(
    className,
    'inline-flex rounded-full px-4 py-1.5 text-sm font-semibold transition',
    invert
      ? 'bg-white text-neutral-950 hover:bg-neutral-200'
      : 'bg-neutral-950 text-white hover:bg-neutral-800',
  )

  let inner = <span className="relative top-px">{children}</span>

  // Check if 'to' prop exists to determine if it's a Link
  if ('to' in props && props.to !== undefined) {
    // Explicitly cast props for Link
    const linkProps = props as RouterLinkProps;
    return (
      <Link className={className} {...linkProps}>
        {inner}
      </Link>
    )
  }

  // Explicitly cast props for button
  const buttonProps = props as HtmlButtonProps;
  return (
    <button className={className} {...buttonProps}>
      {inner}
    </button>
  )
}
