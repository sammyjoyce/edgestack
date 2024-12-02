import React from 'react';

function OurServices() {
  const services = [
    {
      title: 'Paints',
      description:
        'We paint all your internal and external structures to your satisfactions. Call us at 0404 289 437 for quotes.',
      imgSrc: '/assets/pic02-CwMetA50.png',
      alt: 'Paints Design Solution',
    },
    {
      title: 'Kitchens',
      description:
        'We bring life to your kitchens. Call us at 0404 289 437 for design ideas and quotes.',
      imgSrc: '/assets/pic02-CwMetA50.png',
      alt: 'Kitchens Upgrades Kitchen remodeling',
    },
    {
      title: 'Extensions / additions',
      description:
        'We improve your living by adding more space to your home. Call us at 0404 289 437 for quotes.',
      imgSrc: '/assets/pic03-C9sA_m8s.png',
      alt: 'Water Proofing',
    },
    {
      title: 'Bathrooms',
      description:
        'We renovate your bathroom to your budget. Call us at 0404 289 437 for quotes.',
      imgSrc: '/assets/pic04-CxD2NUJX.png',
      alt: 'Bathroom Fit',
    },
    {
      title: 'Remedial works',
      description:
        'We improve your existing structures to your satisfactions. Call us at 0404 289 437 for quotes.',
      imgSrc: '/assets/pic05-Beq0Ah0x.png',
      alt: 'Specialist Services',
    },
    {
      title: 'Decks',
      description:
        'We design and build custom decks. Call us at 0404 289 437 for quotes.',
      imgSrc: '/assets/pic06-BnCQnmx7.png',
      alt: 'Deck Construction',
    },
    {
      title: 'Roofing',
      description:
        'We repair and build your roofs. Call us at 0404 289 437 for quotes.',
      imgSrc: '/assets/pic07-BEtM9hZS.png',
      alt: 'roofing contractor repair services',
    },
    {
      title: 'New Builds',
      description:
        'We build brand new house and structures for your needs starting from design to development. Please call us for detail quotes.',
      imgSrc: '/assets/pic08-B09tdJ9o.png',
      alt: 'New building construction New Homes design development',
    },
    {
      title: 'Alterations',
      description:
        'We can alter and modernize your living to your lifestyle. Call us at 0404 289 437 for quotes.',
      imgSrc: '/assets/pic09-By9toE8x.png',
      alt: 'Office Furniture',
    },
  ];

  return (
    <div className="sp" id="ourservices">
      <h2 className="title mt-10">Our Services</h2>
      <div className="text-white grid md:grid-cols-3 grid-cols-1 md:gap-10 gap-3 mt-20">
        {services.map((service, index) => (
          <div key={index}>
            <div className="relative">
              <img
                className="w-full rounded-md"
                src={service.imgSrc}
                alt={service.alt}
              />
              <div className="absolute inset-0 flex items-center flex-col justify-center bg-black opacity-40"></div>
              <div className="absolute inset-0 flex items-center flex-col justify-center">
                <h2 className="text-xl font-bold text-center mx-auto">
                  {service.title}
                </h2>
                <div>
                  <p className="text-center px-4">{service.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OurServices;
