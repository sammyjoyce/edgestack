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
      <div className="relative h-80 w-full overflow-hidden rounded bg-black">
        <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={previousImage}
            className="rounded-full bg-black/50 p-2 text-gray-100 backdrop-blur-xs transition-all hover:bg-gray-900/50"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <button
            onClick={nextImage}
            className="rounded-full bg-black/50 p-2 text-gray-100 backdrop-blur-xs transition-all hover:bg-gray-900/50"
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
                index === currentImageIndex ? 'w-4 bg-gray-100' : 'w-1.5 bg-gray-300/50'
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
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-101"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </div>
        ))}
      </div>
    </div>
  );
}

const ServiceCard = ({ service, className }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-px rounded-lg bg-gray-900/50"></div>
      <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]">
        <div className="px-8 pt-8 pb-3 sm:px-10 sm:pt-10">
          <h3 className="text-[32px] leading-[36px] tracking-[-0.5px] font-medium 
            bg-gradient-to-r from-white via-white/80 to-gray-300/50 bg-clip-text text-transparent max-lg:text-center">
            {service.title}
          </h3>
          <p className="mt-4 text-gray-300 text-base/6 leading-relaxed max-lg:text-center">
            {service.description}
          </p>
        </div>
        <div className="relative flex-1 w-full mt-6">
          <ImageSlider images={service.images} alt={service.alt} />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-px rounded-lg ring-1 ring-gray-800"></div>
    </div>
  );
};

export default function OurServices() {
  return (
    <div className="relative bg-black py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-[64px] leading-[68px] tracking-[-1.43px] font-medium 
            bg-gradient-to-r from-white via-white/80 to-gray-300/50 bg-clip-text text-transparent">
            Our Services
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            We specialize in transforming spaces with expert craftsmanship and attention to detail.
            From kitchens to complete home renovations, we bring your vision to life.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3">
          {/* Each row is wrapped in a div to ensure equal heights */}
          <div className="grid gap-4 lg:grid-cols-3 lg:contents">
            <div className="relative lg:col-span-2">
              <ServiceCard 
                service={services[0]}
                className="lg:rounded-l-[2rem] h-full"
              />
            </div>
            <div className="relative">
              <ServiceCard 
                service={services[1]}
                className="lg:rounded-r-[2rem] h-full"
              />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3 lg:contents">
            <div className="relative">
              <ServiceCard 
                service={services[2]}
                className="lg:rounded-l-[2rem] h-full"
              />
            </div>
            <div className="relative lg:col-span-2">
              <ServiceCard 
                service={services[3]}
                className="lg:rounded-r-[2rem] h-full"
              />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3 lg:contents">
            <div className="relative lg:col-span-2">
              <ServiceCard 
                service={services[4]}
                className="lg:rounded-l-[2rem] h-full"
              />
            </div>
            <div className="relative">
              <ServiceCard 
                service={services[5]}
                className="lg:rounded-r-[2rem] h-full"
              />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3 lg:contents">
            <div className="relative">
              <ServiceCard 
                service={services[6]}
                className="lg:rounded-l-[2rem] h-full"
              />
            </div>
            <div className="relative lg:col-span-2">
              <ServiceCard 
                service={services[7]}
                className="lg:rounded-r-[2rem] h-full"
              />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3 lg:contents">
            <div className="relative lg:col-span-2">
              <ServiceCard 
                service={services[8]}
                className="lg:rounded-l-[2rem] h-full"
              />
            </div>
            <div className="relative">
              <ServiceCard 
                service={services[9]}
                className="lg:rounded-r-[2rem] h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
