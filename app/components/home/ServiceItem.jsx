import React from "react";
import ImageSlider from "./ImageSlider";

const ServiceItem = ({ service, isReversed }) => {
  const { title, description, images, alt, contact, icon: Icon } = service;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-8">
      {isReversed ? (
        <>
          <div className="relative w-full aspect-video overflow-hidden">
            <ImageSlider images={images} alt={alt} />
          </div>
          <div className="flex flex-col justify-center px-4 lg:px-8 xl:px-16">
            <div className="flex items-center gap-x-3 mb-6">
              <Icon className="h-8 w-8 text-amber-500" aria-hidden="true" />
              <h3 className="text-2xl font-semibold text-white">{title}</h3>
            </div>
            <p className="text-lg text-cyan-200 mb-8">{description}</p>
            <a
              href={`tel:${contact}`}
              className="text-base font-semibold text-cyan-200 hover:text-white transition-colors duration-200"
            >
              {contact}
            </a>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col justify-center px-4 lg:px-8 xl:px-16">
            <div className="flex items-center gap-x-3 mb-6">
              <Icon className="h-8 w-8 text-amber-500" aria-hidden="true" />
              <h3 className="text-2xl font-semibold text-white">{title}</h3>
            </div>
            <p className="text-lg text-cyan-200 mb-8">{description}</p>
            <a
              href={`tel:${contact}`}
              className="text-base font-semibold text-cyan-200 hover:text-white transition-colors duration-200"
            >
              {contact}
            </a>
          </div>
          <div className="relative w-full aspect-video overflow-hidden">
            <ImageSlider images={images} alt={alt} />
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(ServiceItem);
