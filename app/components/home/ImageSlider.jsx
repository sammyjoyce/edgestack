import React, { useState, useRef, useCallback } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const ImageSlider = ({ images, alt }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const minSwipeDistance = 50;

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const onTouchStart = (e) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
  };

  return (
    <div
      className="relative w-full h-full group"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      aria-label="Image Slider"
    >
      <div className="relative h-full w-full overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${alt} ${index + 1}`}
              className="min-w-full h-full object-cover"
              loading="lazy"
            />
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="hidden group-hover:flex items-center justify-center absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/10 rounded-full p-2 backdrop-blur-sm hover:bg-white/20 transition-all z-10"
        aria-label="Previous Slide"
      >
        <ChevronLeftIcon className="h-6 w-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="hidden group-hover:flex items-center justify-center absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/10 rounded-full p-2 backdrop-blur-sm hover:bg-white/20 transition-all z-10"
        aria-label="Next Slide"
      >
        <ChevronRightIcon className="h-6 w-6 text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentIndex === index
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(ImageSlider);
