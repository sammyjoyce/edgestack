import React from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion"; // Use direct import
import { NavLink } from "react-router";
import { Button } from "~/modules/common/components/ui/Button"; // Corrected path

interface MenuItem {
  name: string;
  path: string;
  isRouteLink?: boolean;
  submenu?: { name: string; path: string }[];
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  scrollToSection: (
    event: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => void;
}

export default function MobileMenu({
  isOpen,
  onClose,
  menuItems,
  scrollToSection,
}: MobileMenuProps): React.JSX.Element {
  // Changed to React.JSX.Element
  return (
    <Dialog as="div" className="lg:hidden" open={isOpen} onClose={onClose}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50" // Keep z-index
            aria-hidden="true" // Add aria-hidden for overlay
          />
        )}
      </AnimatePresence>
      <DialogPanel className="fixed inset-shadow-sm inset-shadow-white/5 inset-y-0 right-0 z-50 w-full overflow-y-auto bg-black/95 px-6 py-6 shadow-2xl backdrop-blur-lg sm:max-w-sm sm:ring-1 sm:ring-gray-800">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="-m-1.5 p-1.5" onClick={onClose}>
            <img
              src="/assets/logo_284x137-KoakP1Oi.png"
              alt="LUSH CONSTRUCTIONS"
              className="h-[32px] w-auto sm:h-[40px]"
            />
          </NavLink>
          <button
            type="button"
            className="-m-2.5 rounded-md p-2.5 text-gray-300 transition-all duration-300 ease-in-out hover:text-gray-100"
            onClick={onClose}
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
                  {item.isRouteLink ? (
                    <NavLink
                      to={item.path as any} // Cast needed if item.path isn't strictly a typed path
                      className="-mx-3 block rounded-full px-5 py-2 font-semibold text-base text-gray-300 transition-all duration-300 ease-in-out hover:inset-shadow-sm hover:inset-shadow-white/5 hover:bg-gray-900/50 hover:text-gray-100"
                      onClick={onClose} // Close menu on route navigation
                    >
                      {item.name}
                    </NavLink>
                  ) : (
                    <a
                      href={item.path}
                      className="-mx-3 block rounded-full px-5 py-2 font-semibold text-base text-gray-300 transition-all duration-300 ease-in-out hover:inset-shadow-sm hover:inset-shadow-white/5 hover:bg-gray-900/50 hover:text-gray-100"
                      onClick={(e) => scrollToSection(e, item.path)}
                    >
                      {item.name}
                    </a>
                  )}
                  {item.submenu && (
                    <div className="mt-2 space-y-2 pl-6">
                      {item.submenu.map((subItem) => (
                        // Assuming submenu items are always fragment identifiers for now
                        <a
                          key={subItem.name}
                          href={subItem.path}
                          className="-mx-3 block rounded-full px-5 py-2 font-semibold text-gray-400 text-sm transition-all duration-300 ease-in-out hover:inset-shadow-sm hover:inset-shadow-white/5 hover:bg-gray-900/50 hover:text-gray-100"
                          onClick={(e) => scrollToSection(e, subItem.path)}
                        >
                          {subItem.name}
                        </a>
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
  );
}
