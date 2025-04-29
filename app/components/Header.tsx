import { Dialog, DialogPanel } from "@headlessui/react";
import { Popover } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import type React from "react";
import { useState } from "react";
import { NavLink } from "react-router";
import { Button } from "./ui/Button";

const menuItems = [
  { name: "Home", path: "#hero" },
  {
    name: "Our Services",
    path: "#services",
    submenu: [
      { name: "Renovations", path: "#service-renovations" },
      { name: "Extensions", path: "#service-extensions" },
      { name: "New Builds", path: "#service-new-builds" },
      { name: "Commercial", path: "#service-commercial" },
    ],
  },
  { name: "Projects", path: "/projects", isRouteLink: true },
  { name: "About Us", path: "#about" },
  { name: "Contact Us", path: "#contact" },
];

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    clsx(
      "relative px-5 py-2 rounded-full font-semibold text-base tracking-tight transition-all duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black/60",
      isActive
        ? "text-black bg-white/90 shadow-md"
        : "text-gray-900 hover:text-black hover:bg-white/70 hover:shadow-lg hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-in-out after:absolute after:left-5 after:right-5 after:bottom-1 after:h-0.5 after:bg-black/70 after:scale-x-0 after:origin-left"
    );

  const scrollToSection = (
    event: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    event.preventDefault();
    const element = document.getElementById(sectionId.replace("#", ""));
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky inset-shadow-black/10 inset-shadow-sm inset-x-0 top-0 z-50 w-full flex-none bg-black font-semibold text-[13px] text-white shadow-premium backdrop-blur-xs supports-backdrop-filter:bg-black">
      <nav className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="relative flex items-center justify-between py-2">
          <div className="absolute inset-x-0 bottom-0 h-px bg-gray-800" />

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
                                onClick={(e) =>
                                  scrollToSection(e, subItem.path)
                                }
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
                  className="relative rounded-full px-4 py-2 font-semibold text-base tracking-tight transition-all duration-300 ease-in-out after:absolute after:right-4 after:bottom-1 after:left-4 after:h-0.5 after:origin-left after:scale-x-0 after:bg-black/70 after:transition-transform after:duration-300 after:ease-in-out hover:bg-white/70 hover:shadow-lg hover:after:scale-x-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/60 focus-visible:ring-offset-2"
                  onClick={(e) =>
                    item.isRouteLink ? null : scrollToSection(e, item.path)
                  }
                >
                  {item.name}
                </NavLink>
              )
            )}
          </div>

          {/* Mobile menu button (left) */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2.5 text-gray-300 transition-all duration-300 ease-in-out hover:inset-shadow-sm hover:inset-shadow-white/5 hover:bg-gray-900 hover:text-gray-100"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Logo (centered) */}
          <div className="-translate-x-1/2 absolute left-1/2 flex transform justify-center">
            <NavLink to="/" className="relative z-10">
              <img
                src="/assets/logo_284x137-KoakP1Oi.png"
                alt="LUSH CONSTRUCTIONS"
                className="h-[32px] w-auto sm:h-[40px]"
              />
            </NavLink>
          </div>

          {/* Right navigation items and CTA */}
          <div className="flex items-center">
            {/* Desktop right nav items */}
            <div className="hidden lg:flex lg:items-center lg:gap-x-6">
              {menuItems.slice(2).map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className="relative rounded-full px-4 py-2 font-semibold text-base tracking-tight transition-all duration-300 ease-in-out after:absolute after:right-4 after:bottom-1 after:left-4 after:h-0.5 after:origin-left after:scale-x-0 after:bg-black/70 after:transition-transform after:duration-300 after:ease-in-out hover:bg-white/70 hover:shadow-lg hover:after:scale-x-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/60 focus-visible:ring-offset-2"
                  onClick={(e) =>
                    item.isRouteLink ? null : scrollToSection(e, item.path)
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>

            {/* CTA Button (using Button component) */}
            <Button
              to="tel:0404289437"
              className="group ml-4 flex items-center gap-2 px-3 py-2 sm:ml-8 sm:px-4 sm:py-2 lg:ml-6 min-[80rem]:flex text-sm font-semibold bg-white text-neutral-950 hover:bg-neutral-200 rounded-full shadow-md transition-all duration-300"
              invert
            >
              <span className="flex items-center gap-x-2">
                <svg
                  className="size-4 fill-gray-800 transition-all duration-300 ease-in-out group-hover:fill-black"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="Phone"
                >
                  <title>Phone</title>
                  <path
                    fillRule="evenodd"
                    d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>0404 289 437</span>
              </span>
            </Button>
          </div>
        </div>
      </nav>

      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50"
            />
          )}
        </AnimatePresence>
        <DialogPanel className="fixed inset-shadow-sm inset-shadow-white/5 inset-y-0 right-0 z-50 w-full overflow-y-auto bg-black/95 px-6 py-6 shadow-2xl backdrop-blur-lg sm:max-w-sm sm:ring-1 sm:ring-gray-900">
          <div className="flex items-center justify-between">
            <NavLink
              to="/"
              className="-m-1.5 p-1.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img
                src="/assets/logo_284x137-KoakP1Oi.png"
                alt="LUSH CONSTRUCTIONS"
                className="h-[32px] w-auto sm:h-[40px]"
              />
            </NavLink>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-300 transition-all duration-300 ease-in-out hover:text-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-800">
              <div className="space-y-2 py-6">
                {menuItems.map((item) => (
                  <div key={item.name}>
                    <NavLink
                      to={item.path}
                      className="-mx-3 block rounded-full px-5 py-2 font-semibold text-base text-gray-300 transition-all duration-300 ease-in-out hover:inset-shadow-sm hover:inset-shadow-white/5 hover:bg-gray-900/50 hover:text-gray-100"
                      onClick={(e) =>
                        item.isRouteLink
                          ? setMobileMenuOpen(false)
                          : scrollToSection(e, item.path)
                      }
                    >
                      {item.name}
                    </NavLink>
                    {item.submenu && (
                      <div className="mt-2 space-y-2 pl-6">
                        {item.submenu.map((subItem) => (
                          <NavLink
                            key={subItem.name}
                            to={subItem.path}
                            className="-mx-3 block rounded-full px-5 py-2 font-semibold text-gray-400 text-sm transition-all duration-300 ease-in-out hover:inset-shadow-sm hover:inset-shadow-white/5 hover:bg-gray-900/50 hover:text-gray-100"
                            onClick={(e) => scrollToSection(e, subItem.path)}
                          >
                            {subItem.name}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="py-6">
                <Button to="tel:0404289437" invert className="block w-full">
                  Call Us: 0404 289 437
                </Button>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}

export default Header;
