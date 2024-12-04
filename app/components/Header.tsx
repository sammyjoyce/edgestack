import React, { useState } from "react";
import { NavLink } from "react-router";

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinkClass = ({ isActive }) => 
    `text-amber-100 hover:text-white transition-colors duration-200 ${isActive ? 'font-semibold text-white' : ''}`;

  return (
    <header className="sticky inset-x-0 top-0 max-w-container mx-auto px-4 sm:px-6 lg:px-8 z-50 w-full flex-none text-sm font-semibold bg-black/95 backdrop-blur-sm supports-backdrop-filter:bg-black/80">
      <nav aria-label="Global" className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center py-4">
          <div className="absolute inset-x-0 bottom-0 h-px bg-gray-800/50"></div>
          
          {/* Logo */}
          <NavLink to="/" className="flex-none">
            <img
              src="/assets/logo_284x137-KoakP1Oi.png"
              alt="LUSH CONSTRUCTIONS"
              className="h-20 w-auto"
            />
          </NavLink>

          {/* Announcement Banner */}
          <a href="tel:0404289437" className="group -my-2 ml-6 hidden items-center gap-2 rounded bg-gray-900/50 px-4 py-2 text-xs text-gray-300 ring-1 ring-gray-700 hover:bg-gray-800/50 hover:text-white hover:ring-gray-600 shadow-premium transition-all duration-300 sm:flex md:ml-8 lg:hidden min-[80rem]:flex">
            <svg className="size-4 fill-amber-400 group-hover:fill-amber-300 transition-colors duration-300" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">GET A FREE QUOTE</span>
            <svg width="2" height="2" aria-hidden="true" className="fill-gray-500">
              <circle cx="1" cy="1" r="1" />
            </svg>
            <span className="font-medium group-hover:text-amber-400 transition-colors duration-300">0404 289 437</span>
            <svg width="2" height="2" aria-hidden="true" className="fill-gray-500">
              <circle cx="1" cy="1" r="1" />
            </svg>
            <span className="font-medium">CALL NOW</span>
            <svg viewBox="0 0 5 8" className="h-2 w-[5px] fill-gray-500 group-hover:fill-amber-400 transition-colors duration-300" fillRule="evenodd" clipRule="evenodd" aria-hidden="true">
              <path d="M.2.24A.75.75 0 0 1 1.26.2l3.5 3.25a.75.75 0 0 1 0 1.1L1.26 7.8A.75.75 0 0 1 .24 6.7L3.148 4 .24 1.3A.75.75 0 0 1 .2.24Z" />
            </svg>
          </a>

          {/* Desktop Navigation */}
          <div className="ml-auto hidden lg:flex lg:items-center">
            {[
              { name: 'Home', path: '/' },
              { name: 'Our Services', path: '/ourservices' },
              { name: 'Gallery', path: '/gallery' },
              { name: 'About Us', path: '/aboutus' },
              { name: 'Contact Us', path: '/contactus' }
            ].map((item, index) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={`${navLinkClass} ${index > 0 ? 'ml-8' : ''}`}
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="-my-1 -mr-1 ml-6 flex size-8 items-center justify-center lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="sr-only">Open navigation</span>
            <svg viewBox="0 0 24 24" className="size-6 stroke-amber-100 hover:stroke-white transition-colors duration-200">
              <path d="M3.75 12h16.5M3.75 6.75h16.5M3.75 17.25h16.5" fill="none" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
