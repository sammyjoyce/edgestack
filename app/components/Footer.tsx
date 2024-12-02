import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className="text-white container mx-auto flex gap-2 md:gap-7 md:mb-20 mb-6 mt-8 md:flex-row flex-col justify-center items-center sp text-center md:text-start">
      <p>© 2024 Lush Constructions. All rights reserved.</p>
      <p>
        Designed by :
        <a
          href="https://dot2dotprinting.com.au/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-red-300 pl-1"
        >
          Dot2DotPrinting Ltd.
        </a>
      </p>
    </div>
  );
}

export default Footer;
