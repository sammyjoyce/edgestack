'use client'

import { useState, useEffect } from 'react'
import { ChevronRightIcon } from '@heroicons/react/16/solid'

const slides = [
  {
    src: "/assets/kitchen_3-CQTgEjH4.jpeg",
    alt: "Modern Kitchen Renovations",
    title: "Transform Your Space",
    description: "Expert craftsmanship for your dream home renovations"
  },
  {
    src: "/assets/bathroom_1-LwK3GFf7.jpeg",
    alt: "Luxury Bathroom Designs",
    title: "Quality Renovations",
    description: "Professional construction and renovation services in Sydney"
  },
  {
    src: "/assets/kitchen_1-D3RP3MMZ.jpeg",
    alt: "Custom Kitchen Solutions",
    title: "Custom Solutions",
    description: "Tailored designs that match your lifestyle and budget"
  },
  {
    src: "/assets/kitchen_2-DH4KYJkQ.jpeg",
    alt: "Complete Home Transformations",
    title: "Complete Transformations",
    description: "From concept to completion, we bring your vision to life"
  }
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((currentIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <div className="relative isolate overflow-hidden pt-14">
      <img
        src={slides[currentIndex].src}
        alt={slides[currentIndex].alt}
        className="absolute inset-0 -z-10 size-full object-cover opacity-50"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-linear-to-tr/oklch from-gray-800 to-gray-900 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto  py-32 sm:py-48 lg:py-56">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded px-4 py-2 text-xs leading-none text-gray-300 ring-1 ring-gray-800 hover:ring-gray-700 bg-black/50 shadow-premium backdrop-blur-xs transition-all duration-300 ease-in-out">
              Call us for a free quote{' '}
              <a href="tel:0404289437" className="font-semibold text-gray-100 hover:text-gray-100 transition-all duration-300 ease-in-out">
                <span aria-hidden="true" className="absolute inset-0" />
                0404 289 437 <span aria-hidden="true" className="ml-1 transition-transform duration-300 ease-in-out group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-[40px] leading-[44px] tracking-[-1.43px] md:text-[52px] md:leading-[56px] lg:text-[64px] lg:leading-[68px] font-medium bg-linear-to-r/oklch from-white/95 via-white/90 to-white/80 sm:bg-linear-to-b/oklch md:bg-linear-to-r/oklch bg-clip-text text-transparent">
              {slides[currentIndex].title}
            </h1>
            <p className="mt-8 text-[15px] sm:text-[14px] leading-normal text-pretty text-gray-300">
              {slides[currentIndex].description}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#contact"
                className="rounded bg-gray-900 px-3.5 py-2.5 text-[13px] leading-none font-semibold text-gray-100 shadow-premium backdrop-blur-xs ring-1 ring-gray-800 hover:bg-gray-800 hover:text-gray-100 hover:ring-gray-700 transition-all duration-300 ease-in-out"
              >
                Get a Quote
              </a>
              <a href="#services" className="text-[13px] leading-none font-semibold text-gray-300 hover:text-gray-100 transition-all duration-300 ease-in-out">
                Our Services <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr/oklch from-gray-800 to-gray-900 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
        />
      </div>
    </div>
  )
}
