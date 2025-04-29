import React from "react";
import React from "react"; // Import React
import { Popover } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx"; // Use direct import
import { NavLink } from "react-router";

interface MenuItem {
  name: string;
  path: string;
  isRouteLink?: boolean;
  submenu?: { name: string; path: string }[];
}

interface DesktopNavProps {
  menuItems: MenuItem[];
  scrollToSection: (
    event: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => void;
}

export default function DesktopNav({
  menuItems,
  scrollToSection,
}: DesktopNavProps): JSX.Element {
  return (
    <>
      {/* Left navigation items */}
      <div className="hidden lg:flex lg:items-center lg:gap-x-6">
        {menuItems.slice(0, 2).map((item) =>
          item.submenu ? (
            <Popover key={item.name} className="relative">
              {({ open }) => (
                <>
                  <Popover.Button
                    className={clsx(
                      "flex items-center gap-x-1 font-semibold text-base text-gray-300 transition-all duration-300 ease-in-out hover:text-gray-100",
                      open && "text-gray-100"
                    )}
                  >
                    {item.name}
                    <ChevronDownIcon
                      className={clsx(
                        "h-5 w-5 flex-none text-gray-400 transition-transform duration-300",
                        open && "rotate-180 text-gray-100"
                      )}
                      aria-hidden="true"
                    />
                  </Popover.Button>
                  <Popover.Panel className="-translate-x-1/2 absolute left-1/2 z-10 mt-3 w-screen max-w-min transform px-2">
                    <div className="overflow-hidden rounded-lg bg-gray-900/95 shadow-lg ring-1 ring-gray-800 backdrop-blur-sm">
                      <div className="relative grid gap-6 px-5 py-6 sm:gap-8 sm:p-8">
                        {item.submenu.map((subItem) => (
                          <NavLink
                            key={subItem.name}
                            to={subItem.path}
                            className="-m-3 flex items-start rounded-lg p-3 hover:inset-shadow-sm hover:inset-shadow-white/5 hover:bg-gray-800/50"
                            onClick={(e) => scrollToSection(e, subItem.path)}
                          >
                            <div className="ml-4">
                              <p className="font-medium text-gray-300 text-sm hover:text-gray-100">
                                {subItem.name}
                              </p>
                            </div>
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </Popover.Panel>
                </>
              )}
            </Popover>
          ) : (
            <NavLink
              key={item.name}
              to={item.path}
              className="relative rounded-full px-4 py-2 font-semibold text-base tracking-tight transition-all duration-300 ease-in-out after:absolute after:right-4 after:bottom-1 after:left-4 after:h-0.5 after:origin-left after:scale-x-0 after:bg-black/70 after:transition-transform after:duration-300 after:ease-in-out hover:bg-white/70 hover:shadow-lg hover:after:scale-x-100 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-black/60 focus-visible:ring-offset-2"
              onClick={(e) =>
                item.isRouteLink ? null : scrollToSection(e, item.path)
              }
            >
              {item.name}
            </NavLink>
          )
        )}
      </div>

      {/* Right navigation items */}
      <div className="hidden lg:flex lg:items-center lg:gap-x-6">
        {menuItems.slice(2).map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className="relative rounded-full px-4 py-2 font-semibold text-base tracking-tight transition-all duration-300 ease-in-out after:absolute after:right-4 after:bottom-1 after:left-4 after:h-0.5 after:origin-left after:scale-x-0 after:bg-black/70 after:transition-transform after:duration-300 after:ease-in-out hover:bg-white/70 hover:shadow-lg hover:after:scale-x-100 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-black/60 focus-visible:ring-offset-2"
            onClick={(e) =>
              item.isRouteLink ? null : scrollToSection(e, item.path)
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>
    </>
  );
}
