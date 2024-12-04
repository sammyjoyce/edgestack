import { ChevronRightIcon } from '@heroicons/react/16/solid';
import { useState, useEffect } from 'react'

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

const HeroText = ({ title, description }) => (
  <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
    <div className="hidden sm:mb-10 sm:flex">
      <div className="relative rounded px-4 py-2 text-sm text-gray-200 ring-1 ring-gray-700 hover:ring-gray-600 bg-black/50 shadow-premium backdrop-blur-xs transition-all duration-300">
        Call us for a free quote{' '}
        <a href="tel:0404289437" className="whitespace-nowrap font-semibold text-gray-100 group-hover:text-gray-100">
          <span aria-hidden="true" className="absolute inset-0" />
          0404 289 437 <span aria-hidden="true" className="ml-1 transition-transform duration-200 group-hover:translate-x-1">→</span>
        </a>
      </div>
    </div>
    <h1 className="text-[64px] leading-[68px] tracking-[-1.43px] font-medium bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent md:text-[64px] md:leading-[68px] sm:text-[40px] sm:leading-[44px] sm:tracking-[-0.015em]">
      {title}
    </h1>
    <p className="mt-8 text-gray-300 text-lg leading-relaxed">
      {description}
    </p>
    <div className="mt-10 flex items-center gap-x-6">
      <a
        href="/contact"
        className="rounded px-4 py-2.5 text-sm font-semibold text-gray-100 bg-gray-900/5 ring-1 ring-gray-800 hover:ring-gray-700 transition-all duration-300"
      >
        Get a Quote
      </a>
      <a href="/ourservices" className="text-sm font-semibold leading-6 text-gray-400 transition-colors duration-300 hover:text-white">
        Our Services 
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="inline-block ml-1.5 transition-transform group-hover:translate-x-0.5">
          <path d="M5.46967 11.4697C5.17678 11.7626 5.17678 12.2374 5.46967 12.5303C5.76256 12.8232 6.23744 12.8232 6.53033 12.5303L10.5303 8.53033C10.8207 8.23999 10.8236 7.77014 10.5368 7.47624L6.63419 3.47624C6.34492 3.17976 5.87009 3.17391 5.57361 3.46318C5.27713 3.75244 5.27128 4.22728 5.56054 4.52376L8.94583 7.99351L5.46967 11.4697Z" />
        </svg>
      </a>
    </div>
  </div>
);

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((currentIndex + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <div className="relative isolate overflow-hidden bg-black">
      {/* Background gradient effect */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-gray-800 to-gray-900 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <a href="/projects" className="inline-flex space-x-6">
              <span className="rounded-full bg-gray-900/50 px-3 py-1 text-sm font-semibold leading-6 text-gray-100 ring-1 ring-gray-800/50 backdrop-blur-xs">
                Latest Projects
              </span>
              <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-300">
                <span>View our work</span>
                <ChevronRightIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
              </span>
            </a>
          </div>
          <HeroText title={slides[currentIndex].title} description={slides[currentIndex].description} />
          <div className="mt-10 flex items-center gap-x-6">
            <a
              href="/contact"
              className="rounded bg-gray-900/50 px-3.5 py-2.5 text-sm font-semibold text-gray-100 shadow-premium backdrop-blur-xs ring-1 ring-gray-800/50 hover:bg-gray-800/50 hover:text-gray-100 hover:ring-gray-700/50 transition-all duration-300"
            >
              Get a Quote
            </a>
            <a href="/projects" className="text-sm font-semibold leading-6 text-gray-300 hover:text-gray-100 transition-colors duration-200">
              View Projects <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="relative aspect-[2/1] h-[24.75rem] md:h-[32rem] lg:h-[40rem] rounded-lg bg-gray-900/50 ring-1 ring-gray-800/50 backdrop-blur-xs">
              <img
                src={slides[currentIndex].src}
                alt={slides[currentIndex].alt}
                className="absolute left-0 top-0 w-full h-full rounded-lg object-cover"
                width={2432}
                height={1442}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-black sm:h-32" />
    </div>
  );
}
