import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="z-50 w-full lg:relative my_shadow_nav container mx-auto">
      <div className="font-Cuprum text-[#D3D3D3] sp">
        <div className="lg:hidden">
          <div className="w-[0%] absolute left-0 z-30 cursor-pointer"></div>
          <div
            className={`h-screen absolute top-0 z-50 transition-all duration-300 ${
              isOpen ? 'left-0' : '-left-[75%]'
            }`}
          >
            <ul className="mt-4">
              <li className="py-[1px] px-5">
                <Link
                  to="/"
                  className="text-[#95979d] hover:text-[#3F4044] py-2 w-full px-1 rounded-sm block hover:bg-gray-100"
                >
                  <span
                    className="fade-in"
                    style={{ fontWeight: 'normal', textDecoration: 'none' }}
                  >
                    Home
                  </span>
                </Link>
              </li>
              <li className="py-[1px] px-5">
                <Link
                  to="/ourservices"
                  className="text-[#95979d] hover:text-[#3F4044] py-2 w-full px-1 rounded-sm block hover:bg-gray-100"
                >
                  <span
                    className="fade-in"
                    style={{ fontWeight: 'normal', textDecoration: 'none' }}
                  >
                    Our Services
                  </span>
                </Link>
              </li>
              <li className="py-[1px] px-5">
                <Link
                  to="/gallery"
                  className="text-[#95979d] hover:text-[#3F4044] py-2 w-full px-1 rounded-sm block hover:bg-gray-100"
                >
                  <span
                    className="fade-in"
                    style={{ fontWeight: 'normal', textDecoration: 'none' }}
                  >
                    Gallery
                  </span>
                </Link>
              </li>
              <li className="py-[1px] px-5">
                <Link
                  to="/aboutus"
                  className="text-[#95979d] hover:text-[#3F4044] py-2 w-full px-1 rounded-sm block hover:bg-gray-100"
                >
                  <span
                    className="fade-in"
                    style={{ fontWeight: 'normal', textDecoration: 'none' }}
                  >
                    About Us
                  </span>
                </Link>
              </li>
              <li className="py-[1px] px-5">
                <Link
                  to="/contactus"
                  className="text-[#95979d] hover:text-[#3F4044] py-2 w-full px-1 rounded-sm block hover:bg-gray-100"
                >
                  <span
                    className="fade-in"
                    style={{ fontWeight: 'normal', textDecoration: 'none' }}
                  >
                    Contact Us
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Link to="/" className="inline-block">
            <img
              src="/assets/logo_284x137-KoakP1Oi.png"
              alt="LUSH CONSTRUCTIONS construction company Home Improvement high-quality construction"
            />
          </Link>
          <div>
            <div className="flex items-center">
              <div className="md:block hidden">
                <div>
                  <div className="flex items-end flex-col">
                    <h2 className="text-white font-bold text-center mb-1 sticky top-2 -mt-8">
                      PLEASE CONTACT 0404 289 437 FOR A QUOTE
                    </h2>
                    <ul className="flex items-center justify-end hover:text-[#5A5A5A] gap-4 mt-2">
                      <li>
                        <Link
                          to="/"
                          className="flex items-center text-lg hover:text-white text-[17px] font-Inter focus:text-white"
                          style={{ textDecoration: 'none' }}
                        >
                          <span
                            className="fade-in"
                            style={{
                              fontWeight: 'normal',
                              textDecoration: 'none',
                            }}
                          >
                            Home
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/ourservices"
                          className="flex items-center text-lg hover:text-white text-[17px] font-Inter focus:text-white"
                          style={{ textDecoration: 'none' }}
                        >
                          <span
                            className="fade-in"
                            style={{
                              fontWeight: 'normal',
                              textDecoration: 'none',
                            }}
                          >
                            Our Services
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/gallery"
                          className="flex items-center text-lg hover:text-white text-[17px] font-Inter focus:text-white"
                          style={{ textDecoration: 'none' }}
                        >
                          <span
                            className="fade-in"
                            style={{
                              fontWeight: 'normal',
                              textDecoration: 'none',
                            }}
                          >
                            Gallery
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/aboutus"
                          className="flex items-center text-lg hover:text-white text-[17px] font-Inter focus:text-white"
                          style={{ textDecoration: 'none' }}
                        >
                          <span
                            className="fade-in"
                            style={{
                              fontWeight: 'normal',
                              textDecoration: 'none',
                            }}
                          >
                            About Us
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/contactus"
                          className="flex items-center text-lg hover:text-white text-[17px] font-Inter focus:text-white"
                          style={{ textDecoration: 'none' }}
                        >
                          <span
                            className="fade-in"
                            style={{
                              fontWeight: 'normal',
                              textDecoration: 'none',
                            }}
                          >
                            Contact Us
                          </span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="md:hidden">
            <div className="flex items-end flex-col">
              <h2 className="text-white font-bold text-center mb-1 -mt-6">
                CONTACT 0404 289 437
              </h2>
              <button
                className="text-white mt-2"
                onClick={() => setIsOpen(!isOpen)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-10 h-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
