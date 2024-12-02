import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';

function ImageSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const slides = [
    {
      src: '/assets/kitchen_3-CQTgEjH4.jpeg',
      alt: 'Home renovations Kitchen remodeling New building construction',
    },
    {
      src: '/assets/bathroom_1-LwK3GFf7.jpeg',
      alt: 'Home renovations Kitchen remodeling New building construction',
    },
    {
      src: '/assets/kitchen_1-D3RP3MMZ.jpeg',
      alt: 'Home renovations Kitchen remodeling New building construction',
    },
    {
      src: '/assets/kitchen_2-DH4KYJkQ.jpeg',
      alt: 'Home renovations Kitchen remodeling New building construction',
    },
    {
      src: '/assets/kitchen_3-CQTgEjH4.jpeg',
      alt: 'Home renovations Kitchen remodeling New building construction',
    },
    {
      src: '/assets/bathroom_1-LwK3GFf7.jpeg',
      alt: 'Home renovations Kitchen remodeling New building construction',
    },
    {
      src: '/assets/kitchen_1-D3RP3MMZ.jpeg',
      alt: 'Home renovations Kitchen remodeling New building construction',
    },
    {
      src: '/assets/kitchen_2-DH4KYJkQ.jpeg',
      alt: 'Home renovations Kitchen remodeling New building construction',
    },
    {
      src: '/assets/kitchen_3-CQTgEjH4.jpeg',
      alt: 'Home renovations Kitchen remodeling New building construction',
    },
  ];

  return (
    <div className="w-full mt-2">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index}>
            <img
              className="w-full md:h-screen h-80 rounded-md"
              src={slide.src}
              alt={slide.alt}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default ImageSlider;
