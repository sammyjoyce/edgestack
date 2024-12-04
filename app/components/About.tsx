import { CheckCircleIcon } from '@heroicons/react/20/solid'

const features = [
  'Custom Home Builds',
  'Home Extensions & Renovations',
  'Commercial Construction',
  'Project Management',
  'Design & Planning',
  'Council Approvals',
]

const team = [
  {
    name: 'Merlin',
    role: 'Owner / Lead Builder',
    imageUrl: '/assets/merlin.jpg',
    bio: 'With over 20 years of building expertise, Merlin leads Lush Constructions with a passion for excellence and dedication to quality craftsmanship. His extensive experience in the construction industry ensures that every project meets the highest standards of quality and client satisfaction.',
    instagramUrl: 'https://www.instagram.com/lushconstructions',
  },
  {
    name: 'Jemima',
    role: 'Apprentice Builder',
    imageUrl: '/assets/jemima.jpg',
    bio: "As our dedicated apprentice builder, Jemima brings fresh energy and enthusiasm to the team. She is committed to learning and developing her skills under Merlin's mentorship, contributing to our projects while representing the future of construction excellence.",
    instagramUrl: 'https://www.instagram.com/lushconstructions',
  }
]

export default function AboutUs() {
  return (
    <div className="relative bg-gray-950 py-24 sm:py-32 overflow-hidden">
      {/* Gradient polygon background */}
      <div 
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
   <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#13B5C8" stroke-width="0.5" opacity="0.2"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grid)" />
      </div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 w-full h-full" aria-hidden="true">
        <svg className="absolute h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-about" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-accent-500/10" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-about)" />
        </svg>
      </div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-20 px-6 lg:px-8 xl:grid-cols-3">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-base font-semibold leading-7 text-accent-400">About Us</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl [text-wrap:balance]">
            Meet Our Team
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            The building team at Lush Constructions consists of dedicated professionals who bring your vision to life. 
            We strive to deliver the highest quality of construction to make your dreams a reality.
          </p>
          <div className="mt-10 space-y-4">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-x-2">
                <CheckCircleIcon className="size-5 flex-none text-accent-400" aria-hidden="true" />
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
        <ul
          role="list"
          className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:gap-x-8 xl:col-span-2"
        >
          {team.map((person) => (
            <li key={person.name} className="rounded bg-gray-950/50 ring-1 ring-primary-700 hover:ring-primary-600 shadow-subtle hover:shadow-elevated transition-all duration-200">
              <img className="mx-auto  w-full h-auto rounded object-cover" src={person.imageUrl} alt="" />
              <div className="p-8"><h3 className="text-base font-semibold leading-7 tracking-tight text-white">{person.name}</h3>
              <p className="text-sm leading-6 text-gray-400">{person.role}</p>
              <p className="mt-4 text-base leading-7 text-gray-300">{person.bio}</p>
              <ul role="list" className="mt-6 flex justify-center gap-x-6">
                <li>
                  <a
                    href={person.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-accent-400 transition-colors"
                  >
                    <span className="sr-only">Instagram</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      className="h-5 w-5"
                      aria-hidden="true"
                      fill="currentColor"
                    >
                      <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                    </svg>
                  </a>
                </li>
              </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6" aria-hidden="true">
        <div
          className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-gray-900 to-accent-900/50 opacity-30"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
    </div>
  );
}
