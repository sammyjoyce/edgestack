'use client'

import { useState, useEffect } from 'react';

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
    <div className="bg-black">
      <div className="relative">
        <div className="mx-auto max-w-7xl">
          <div className="relative z-10 pt-14 lg:w-full lg:max-w-2xl">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
              className="absolute inset-y-0 right-8 hidden h-full w-80 translate-x-1/2 transform fill-black lg:block"
            >
              <polygon points="0,0 90,0 50,100 0,100" />
            </svg>

            <div className="relative px-6 py-32 sm:py-40 lg:px-8 lg:py-56 lg:pr-0">
              <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
                <div className="hidden sm:mb-10 sm:flex">
                  <div className="relative rounded px-4 py-2 text-sm text-gray-200 ring-1 ring-gray-700 hover:ring-gray-600 bg-gray-900/50 shadow-premium backdrop-blur-sm transition-all duration-300">
                    Call us for a free quote{' '}
                    <a href="tel:0404289437" className="whitespace-nowrap font-semibold text-white group-hover:text-amber-400">
                      <span aria-hidden="true" className="absolute inset-0" />
                      0404 289 437 <span aria-hidden="true" className="ml-1 transition-transform duration-200 group-hover:translate-x-1">→</span>
                    </a>
                  </div>
                </div>
                <h1 className="text-pretty font-display text-5xl font-bold tracking-tight text-white sm:text-7xl [text-wrap:balance]">
                  {slides[currentIndex].title}
                </h1>
                <p className="mt-8 text-pretty text-lg text-gray-300 sm:text-xl [text-wrap:balance] leading-relaxed">
                  {slides[currentIndex].description}
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <a
                    href="/contactus"
                    className="rounded bg-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-elegant hover:bg-amber-400 hover:shadow-float focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 transition-all duration-300"
                  >
                    Get a Quote
                  </a>
                  <a href="/ourservices" className="group text-sm font-semibold text-gray-300 hover:text-white transition-colors duration-300">
                    View Services <span aria-hidden="true" className="ml-1 transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slide.src}
                alt={slide.alt}
                className="aspect-3/2 object-cover lg:aspect-auto lg:size-full"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>
            </div>
          ))}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
