import React from "react";
import { CalendarDaysIcon, HandRaisedIcon } from '@heroicons/react/24/outline'

interface Collaboration {
  name: string;
  icon: React.ElementType;
  description: string;
  link?: string;
}

const collaborations: Collaboration[] = [
  {
    name: 'Free Consultations',
    icon: CalendarDaysIcon,
    description: 'Book a free consultation with our experts. We\'ll discuss your project needs and provide professional advice.',
  },
  {
    name: 'Expert Support',
    icon: HandRaisedIcon,
    description: 'Our team of skilled professionals is here to guide you through every step of your construction journey.',
  },
];

export default function CollaborationAndConsultations() {
  return (
    <div className="bg-gray-950 py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-20 px-6 lg:px-8 xl:grid-cols-3">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none xl:col-span-2">
          {collaborations.map((collab) => (
            <div key={collab.name} className="flex flex-col rounded bg-gray-950/50 p-8 ring-1 ring-cyan-700 hover:ring-cyan-600 shadow-subtle hover:shadow-elevated transition-all duration-200">
              <dt className="text-base font-semibold leading-7 text-white">
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded bg-amber-500">
                  <collab.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                {collab.name}
              </dt>
              <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-cyan-200">
                <p className="flex-auto">{collab.description}</p>
                {collab.link && (
                  <p className="mt-6">
                    <a href={collab.link} className="text-sm font-semibold leading-6 text-amber-500 hover:text-amber-400 transition-colors duration-200">
                      Learn more <span aria-hidden="true">→</span>
                    </a>
                  </p>
                )}
              </dd>
            </div>
          ))}
        </div>
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-base font-semibold leading-7 text-cyan-200">Collaboration</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Building Together</p>
          <p className="mt-6 text-lg leading-8 text-cyan-200">
            We believe in collaborative construction, working closely with clients, architects, and designers to bring your vision to life.
          </p>
        </div>
      </div>
      <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6" aria-hidden="true">
        <div
          className="aspect-1155/678 w-[72.1875rem] bg-linear-to-tr from-[#1f2937] to-[#1e3a8a] opacity-30"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
    </div>
  )
}
