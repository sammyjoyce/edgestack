import React from "react";
import { BuildingOffice2Icon, EnvelopeIcon, PhoneIcon, ClockIcon } from '@heroicons/react/24/outline'

export default function ContactUs() {
  return (
    <div className="relative isolate" id="contact-us">
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
        <div className="relative px-6 pb-20 pt-24 sm:pt-32 lg:static lg:px-8 lg:py-48">
          <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
            <div className="absolute inset-y-0 left-0 -z-10 w-full overflow-hidden ring-1 ring-gray-800 lg:w-1/2">
              <svg
                className="absolute inset-0 h-full w-full stroke-gray-800 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
                aria-hidden="true"
              >
                <defs>
                  <pattern
                    id="54f88622-e7f8-4f1d-aaf9-c2f5e46dd1f2"
                    width={200}
                    height={200}
                    x="100%"
                    y={-1}
                    patternUnits="userSpaceOnUse"
                  >
                    <path d="M130 200V.5M.5 .5H200" fill="none" />
                  </pattern>
                </defs>
                <svg x="100%" y={-1} className="overflow-visible fill-gray-900/20">
                  <path d="M-470.5 0h201v201h-201Z" strokeWidth={0} />
                </svg>
                <rect width="100%" height="100%" strokeWidth={0} fill="url(#54f88622-e7f8-4f1d-aaf9-c2f5e46dd1f2)" />
              </svg>
              <div
                aria-hidden="true"
                className="absolute top-[calc(100%-13rem)] -left-56 transform-gpu blur-3xl lg:top-[calc(50%-7rem)] lg:left-[max(-14rem,calc(100%-59rem))]"
              >
                <div
                  style={{
                    clipPath:
                      'polygon(74.1% 56.1%, 100% 38.6%, 97.5% 73.3%, 85.5% 100%, 80.7% 98.2%, 72.5% 67.7%, 60.2% 37.8%, 52.4% 32.2%, 47.5% 41.9%, 45.2% 65.8%, 27.5% 23.5%, 0.1% 35.4%, 17.9% 0.1%, 27.6% 23.5%, 76.1% 2.6%, 74.1% 56.1%)',
                  }}
                  className="aspect-1155/678 w-[72.1875rem] bg-gradient-to-br from-gray-800/20 to-gray-700/20 opacity-20"
                />
              </div>
            </div>
            <h2 className="text-base font-semibold leading-7 text-gray-300">Let's Transform Your Space</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl [text-wrap:balance]">Ready to Start Your Project?</p>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              From concept to completion, we're here to help bring your vision to life. Our expert team specializes in turning your ideas into stunning reality.
            </p>
            
            <dl className="mt-10 space-y-4 text-base leading-7 text-gray-300">
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Address</span>
                  <BuildingOffice2Icon className="h-7 w-6 text-gray-300" aria-hidden="true" />
                </dt>
                <dd>
                  PO BOX 821
                  <br />
                  Marrickville, NSW 2204
                </dd>
              </div>
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Telephone</span>
                  <PhoneIcon className="h-7 w-6 text-gray-300" aria-hidden="true" />
                </dt>
                <dd>
                  <a href="tel:0404289437" className="hover:text-gray-100 transition-colors">
                    0404 289 437
                  </a>
                </dd>
              </div>
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Email</span>
                  <EnvelopeIcon className="h-7 w-6 text-gray-300" aria-hidden="true" />
                </dt>
                <dd>
                  <a href="mailto:contact@lushconstructions.com" className="hover:text-gray-100 transition-colors">
                    contact@lushconstructions.com
                  </a>
                </dd>
              </div>
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Hours</span>
                  <ClockIcon className="h-7 w-6 text-gray-300" aria-hidden="true" />
                </dt>
                <dd>
                  Monday - Friday: 7am - 5pm
                  <br />
                  Saturday: By appointment
                </dd>
              </div>
            </dl>
            <div className="mt-8 space-y-2 text-sm/6 text-gray-400">
              <p className="font-medium">ABN: 99 652 947 528</p>
              <p className="font-medium">ACN: 141 565 746</p>
              <p className="font-medium">License Number: TBD</p>
            </div>
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-100">Follow Us</h3>
              <ul className="mt-4 flex gap-3">
                <li>
                  <a
                    href="https://www.instagram.com/lushconstructions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-800 text-gray-300 hover:bg-gray-800/10 hover:text-gray-100 hover:border-gray-700/50 transition-all duration-300"
                  >
                    <span className="sr-only">Instagram</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path
                        fill="currentColor"
                        d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
                      />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <form 
          action="https://api.web3forms.com/submit" 
          method="POST" 
          className="px-6 pb-24 pt-20 sm:pb-32 lg:px-8 lg:py-48 bg-gray-900/50 backdrop-blur-sm"
        >
          <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <input type="hidden" name="access_key" value="a99ac5a8-4ff7-4500-80ca-fc44b389460b" />
              
              <div className="sm:col-span-2">
                <label htmlFor="project-type" className="block text-sm font-semibold leading-6 text-gray-300">
                  Project Type
                </label>
                <div className="mt-2.5">
                  <select
                    id="project-type"
                    name="project-type"
                    className="block w-full rounded-md border-0 bg-black/50 px-3.5 py-2 text-gray-100 shadow-premium ring-1 ring-inset ring-gray-800 focus:ring-2 focus:ring-inset focus:ring-gray-700 sm:text-sm sm:leading-6 transition-all"
                  >
                    <option value="">Select a renovation type</option>
                    <option value="full-home">Full Home Renovation</option>
                    <option value="kitchen">Kitchen Renovation</option>
                    <option value="bathroom">Bathroom Renovation</option>
                    <option value="extension">Home Extension</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-gray-300">
                  First name
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    autoComplete="given-name"
                    required
                    className="block w-full rounded-md border-0 bg-black/50 px-3.5 py-2 text-gray-100 shadow-premium ring-1 ring-inset ring-gray-800 focus:ring-2 focus:ring-inset focus:ring-gray-700 sm:text-sm sm:leading-6 transition-all"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-gray-300">
                  Last name
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    name="last-name"
                    id="last-name"
                    autoComplete="family-name"
                    required
                    className="block w-full rounded-md border-0 bg-black/50 px-3.5 py-2 text-gray-100 shadow-premium ring-1 ring-inset ring-gray-800 focus:ring-2 focus:ring-inset focus:ring-gray-700 sm:text-sm sm:leading-6 transition-all"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-300">
                  Email
                </label>
                <div className="mt-2.5">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border-0 bg-black/50 px-3.5 py-2 text-gray-100 shadow-premium ring-1 ring-inset ring-gray-800 focus:ring-2 focus:ring-inset focus:ring-gray-700 sm:text-sm sm:leading-6 transition-all"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="phone-number" className="block text-sm font-semibold leading-6 text-gray-300">
                  Phone number
                </label>
                <div className="mt-2.5">
                  <input
                    type="tel"
                    name="phone-number"
                    id="phone-number"
                    autoComplete="tel"
                    className="block w-full rounded-md border-0 bg-black/50 px-3.5 py-2 text-gray-100 shadow-premium ring-1 ring-inset ring-gray-800 focus:ring-2 focus:ring-inset focus:ring-gray-700 sm:text-sm sm:leading-6 transition-all"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-300">
                  Message
                </label>
                <div className="mt-2.5">
                  <textarea
                    name="message"
                    id="message"
                    rows={4}
                    className="block w-full rounded-md border-0 bg-black/50 px-3.5 py-2 text-gray-100 shadow-premium ring-1 ring-inset ring-gray-800 focus:ring-2 focus:ring-inset focus:ring-gray-700 sm:text-sm sm:leading-6 transition-all"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="rounded-md bg-black px-3.5 py-2.5 text-center text-sm font-semibold text-gray-100 shadow-premium ring-1 ring-inset ring-gray-800 hover:bg-gray-900 hover:text-white hover:ring-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-700 transition-all"
              >
                Send message
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
