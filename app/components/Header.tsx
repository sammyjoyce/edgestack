import React, { useState } from "react";
import { NavLink } from "react-router";
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

const menuItems = [
  { name: 'Home', path: '/' },
  { name: 'Our Services', path: '/ourservices' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'About Us', path: '/aboutus' },
  { name: 'Contact Us', path: '/contactus' }
];

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) => 
    `text-[13px] leading-none font-medium sm:text-[15px] sm:leading-loose ${isActive ? 'text-gray-100' : 'text-gray-300 hover:text-gray-100 transition-all duration-300 ease-in-out'}`;

  return (
    <header className="sticky inset-x-0 top-0 z-50 w-full flex-none text-[13px] font-semibold bg-black/60 backdrop-blur-xs supports-backdrop-filter:bg-black/60 shadow-premium">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative flex items-center justify-between py-4">
          <div className="absolute inset-x-0 bottom-0 h-px bg-gray-800"></div>
          
          <div className="flex items-center">
            {/* Logo */}
            <NavLink to="/" className="relative z-10">
              <img
                src="/assets/logo_284x137-KoakP1Oi.png"
                alt="LUSH CONSTRUCTIONS"
                className="h-20 w-auto"
              />
            </NavLink>

            {/* Announcement Banner */}
            <a href="tel:0404289437" className="group hidden items-center gap-2 rounded bg-gray-900 px-4 py-2 text-xs leading-none font-medium text-gray-300 ring-1 ring-gray-800 hover:bg-gray-800 hover:text-gray-100 hover:ring-gray-700 shadow-premium transition-all duration-300 ease-in-out sm:ml-8 sm:flex lg:hidden min-[80rem]:flex">
              <svg className="size-4 fill-gray-300 group-hover:fill-gray-100 transition-all duration-300 ease-in-out" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Get a Quote</span>
              <span className="font-medium group-hover:text-gray-100 transition-all duration-300 ease-in-out">0404 289 437</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2.5 text-gray-300 hover:text-gray-100 transition-all duration-300 ease-in-out"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:gap-x-12">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={navLinkClass}
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-black/95 backdrop-blur-lg px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900">
          <div className="flex items-center justify-between">
            <NavLink to="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
              <img
                src="/assets/logo_284x137-KoakP1Oi.png"
                alt="LUSH CONSTRUCTIONS"
                className="h-20 w-auto"
              />
            </NavLink>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-300 hover:text-gray-100 transition-all duration-300 ease-in-out"
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
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-300 hover:text-gray-100 hover:bg-gray-900/50 transition-all duration-300 ease-in-out"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
              <div className="py-6">
                <a
                  href="tel:0404289437"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-300 hover:text-gray-100 hover:bg-gray-900/50 transition-all duration-300 ease-in-out"
                >
                  Call Us: 0404 289 437
                </a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}

export default Header;
