import React, { useState } from "react";
import { PhoneIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

const services = [
  {
    title: "Restorations & Alterations",
    description: "Expert restoration and alteration services to breathe new life into your property. We help you reimagine and modify your space to better suit your needs.",
    images: [
      "/assets/pic02-CwMetA50.png",
      "/assets/pic03-C9sA_m8s.png",
      "/assets/pic04-CxD2NUJX.png"
    ],
    alt: "Restorations and Alterations",
    contact: "0404 289 437",
    icon: PhoneIcon,
    name: "Restorations"
  },
  {
    title: "Extensions & Additions",
    description: "Expand your living space with our professional extension services. We handle everything from planning to final touches, ensuring seamless integration with your existing structure.",
    images: [
      "/assets/pic02-CwMetA50.png",
      "/assets/pic03-C9sA_m8s.png",
      "/assets/pic04-CxD2NUJX.png"
    ],
    alt: "Extensions and Additions",
    contact: "0404 289 437",
    icon: PhoneIcon,
    name: "Extensions"
  },
  {
    title: "Granny Flats",
    description: "Custom-built secondary dwellings perfect for family or rental opportunities. We create comfortable, self-contained living spaces that add value to your property.",
    images: [
      "/assets/pic02-CwMetA50.png",
      "/assets/pic03-C9sA_m8s.png",
      "/assets/pic04-CxD2NUJX.png"
    ],
    alt: "Granny Flats Construction",
    contact: "0404 289 437",
    icon: PhoneIcon,
    name: "GrannyFlats"
  },
  {
    title: "New Builds",
    description: "Complete new home construction services. From initial design to final details, we build your dream home with quality materials and expert craftsmanship.",
    images: [
      "/assets/pic08-B09tdJ9o.png",
      "/assets/pic03-C9sA_m8s.png",
      "/assets/pic04-CxD2NUJX.png"
    ],
    alt: "New building construction",
    contact: "0404 289 437",
    icon: PhoneIcon,
    name: "NewBuilds"
  },
  {
    title: "Shop & Office Fit-outs",
    description: "Professional commercial space renovations and custom fit-outs. We create functional and attractive workspaces that reflect your brand and business needs.",
    images: [
      "/assets/pic02-CwMetA50.png",
      "/assets/pic03-C9sA_m8s.png",
      "/assets/pic04-CxD2NUJX.png"
    ],
    alt: "Commercial Fit-outs",
    contact: "0404 289 437",
    icon: PhoneIcon,
    name: "Commercial"
  },
  {
    title: "Kitchens & Bathrooms",
    description: "Transform your essential spaces with modern renovations. Our expert team delivers high-quality finishes, expert waterproofing, and beautiful, functional designs.",
    images: [
      "/assets/pic02-CwMetA50.png",
      "/assets/pic03-C9sA_m8s.png",
      "/assets/pic04-CxD2NUJX.png"
    ],
    alt: "Kitchen and Bathroom Renovations",
    contact: "0404 289 437",
    icon: PhoneIcon,
    name: "KitchensBathrooms"
  },
  {
    title: "Remedial Works",
    description: "Expert remedial construction services to address structural issues and maintain building integrity. We provide comprehensive solutions for all types of building repairs.",
    images: [
      "/assets/pic05-Beq0Ah0x.png",
      "/assets/pic03-C9sA_m8s.png",
      "/assets/pic04-CxD2NUJX.png"
    ],
    alt: "Remedial Construction",
    contact: "0404 289 437",
    icon: PhoneIcon,
    name: "Remedial"
  },
  {
    title: "Decks, Fences & Pergolas",
    description: "Create beautiful outdoor living spaces with our custom deck, fence, and pergola construction. We design and build durable structures that complement your home's architecture.",
    images: [
      "/assets/pic06-BnCQnmx7.png",
      "/assets/pic03-C9sA_m8s.png",
      "/assets/pic04-CxD2NUJX.png"
    ],
    alt: "Outdoor Structures",
    contact: "0404 289 437",
    icon: PhoneIcon,
    name: "OutdoorStructures"
  },
  {
    title: "Doors, Stairs & Flooring",
    description: "Quality installations for essential home features. We specialize in custom staircases, door installations, and premium flooring solutions that enhance your home's functionality and appeal.",
    images: [
      "/assets/pic02-CwMetA50.png",
      "/assets/pic03-C9sA_m8s.png",
      "/assets/pic04-CxD2NUJX.png"
    ],
    alt: "Interior Features",
    contact: "0404 289 437",
    icon: PhoneIcon,
    name: "InteriorFeatures"
  },
  {
    title: "Roofing",
    description: "Comprehensive roofing services including repairs, replacements, and maintenance. We ensure your roof provides reliable protection and enhances your home's appearance.",
    images: [
      "/assets/pic07-BEtM9hZS.png",
      "/assets/pic03-C9sA_m8s.png",
      "/assets/pic04-CxD2NUJX.png"
    ],
    alt: "Roofing Services",
    contact: "0404 289 437",
    icon: PhoneIcon,
    name: "Roofing"
  },
  {
    title: "Painting",
    description: "Professional interior and exterior painting services for a fresh, modern look. Our expert team ensures flawless finishes and lasting results.",
    images: [
      "/assets/pic02-CwMetA50.png",
      "/assets/pic03-C9sA_m8s.png",
      "/assets/pic04-CxD2NUJX.png"
    ],
    alt: "Painting Services",
    contact: "0404 289 437",
    icon: PhoneIcon,
    name: "Painting"
  }
];

function ImageSlider({ images, alt }: { images: string[], alt: string }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="relative group">
      <div className="relative h-80 w-full overflow-hidden rounded bg-gray-900">
        <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={previousImage}
            className="rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/20"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <button
            onClick={nextImage}
            className="rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-all hover:bg-white/20"
            aria-label="Next image"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                index === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
              }`}
              onClick={() => setCurrentImageIndex(index)}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
        {images.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`${alt} - Image ${index + 1}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OurServices() {
  return (
    <section className="relative isolate bg-gray-950 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-accent-400">Our Services</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl [text-wrap:balance]">
            Comprehensive Construction Solutions
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            From concept to completion, we deliver exceptional craftsmanship and attention to detail in every project.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {services.map((service) => (
            <div key={service.title} className="group flex flex-col">
              <ImageSlider images={service.images} alt={service.alt} />
              <div className="mt-8">
                <div className="flex items-center gap-x-3">
                  <h3 className="text-lg font-semibold leading-8 tracking-tight text-white group-hover:text-accent-400 transition-colors duration-300">
                    {service.title}
                  </h3>
                </div>
                <p className="mt-5 text-sm leading-7 text-gray-300">{service.description}</p>
                <div className="mt-6 flex items-center gap-x-3">
                  <service.icon className="h-5 w-5 flex-none text-accent-400" aria-hidden="true" />
                  <a
                    href={`tel:${service.contact.replace(/\s/g, '')}`}
                    className="text-sm leading-6 text-gray-300 hover:text-accent-400 transition-colors duration-300"
                  >
                    {service.contact}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6" aria-hidden="true">
        <div
          className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-accent-900 to-accent-800/70 opacity-30"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
    </section>
  );
}
