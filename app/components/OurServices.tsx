import {
	ChevronLeftIcon,
	ChevronRightIcon,
	PhoneIcon,
} from "@heroicons/react/24/outline";
import { HTMLMotionProps, motion, MotionValue, useMotionValueEvent, useSpring } from "framer-motion";
import React, { useCallback, useLayoutEffect, useRef, useState } from "react";

const services = [
	{
		title: "Restorations & Alterations",
		description:
			"Expert restoration and alteration services to breathe new life into your property. We help you reimagine and modify your space to better suit your needs.",
		images: [
			"/assets/pic02-CwMetA50.png",
			"/assets/pic03-C9sA_m8s.png",
			"/assets/pic04-CxD2NUJX.png",
		],
		alt: "Restorations and Alterations",
		contact: "0404 289 437",
		icon: PhoneIcon,
		name: "Restorations",
	},
	{
		title: "Extensions & Additions",
		description:
			"Expand your living space with our professional extension services. We handle everything from planning to final touches, ensuring seamless integration with your existing structure.",
		images: [
			"/assets/pic13-C3BImLY9.png",
			"/assets/pic03-C9sA_m8s.png",
			"/assets/pic04-CxD2NUJX.png",
		],
		alt: "Extensions and Additions",
		contact: "0404 289 437",
		icon: PhoneIcon,
		name: "Extensions",
	},
	{
		title: "Granny Flats",
		description:
			"Custom-built secondary dwellings perfect for family or rental opportunities. We create comfortable, self-contained living spaces that add value to your property.",
		images: [
			"/assets/pic09-By9toE8x.png",
			"/assets/pic03-C9sA_m8s.png",
			"/assets/pic04-CxD2NUJX.png",
		],
		alt: "Granny Flats Construction",
		contact: "0404 289 437",
		icon: PhoneIcon,
		name: "GrannyFlats",
	},
	{
		title: "New Builds",
		description:
			"Complete new home construction services. From initial design to final details, we build your dream home with quality materials and expert craftsmanship.",
		images: [
			"/assets/pic08-B09tdJ9o.png",
			"/assets/pic03-C9sA_m8s.png",
			"/assets/pic04-CxD2NUJX.png",
		],
		alt: "New building construction",
		contact: "0404 289 437",
		icon: PhoneIcon,
		name: "NewBuilds",
	},
	{
		title: "Shop & Office Fit-outs",
		description:
			"Professional commercial space renovations and custom fit-outs. We create functional and attractive workspaces that reflect your brand and business needs.",
		images: [
			"/assets/pic06-BnCQnmx7.png",
			"/assets/pic03-C9sA_m8s.png",
			"/assets/pic04-CxD2NUJX.png",
		],
		alt: "Commercial Fit-outs",
		contact: "0404 289 437",
		icon: PhoneIcon,
		name: "Commercial",
	},
	{
		title: "Kitchens & Bathrooms",
		description:
			"Transform your essential spaces with modern renovations. Our expert team delivers high-quality finishes, expert waterproofing, and beautiful, functional designs.",
		images: [
			"/assets/pic04-CxD2NUJX.png",
			"/assets/pic03-C9sA_m8s.png",
			"/assets/pic02-CwMetA50.png",
		],
		alt: "Kitchen and Bathroom Renovations",
		contact: "0404 289 437",
		icon: PhoneIcon,
		name: "KitchensBathrooms",
	},
	{
		title: "Remedial Works",
		description:
			"Expert remedial construction services to address structural issues and maintain building integrity. We provide comprehensive solutions for all types of building repairs.",
		images: [
			"/assets/pic05-Beq0Ah0x.png",
			"/assets/pic03-C9sA_m8s.png",
			"/assets/pic04-CxD2NUJX.png",
		],
		alt: "Remedial Construction",
		contact: "0404 289 437",
		icon: PhoneIcon,
		name: "Remedial",
	},
	{
		title: "Decks, Fences & Pergolas",
		description:
			"Create beautiful outdoor living spaces with our custom deck, fence, and pergola construction. We design and build durable structures that complement your home's architecture.",
		images: [
			"/assets/pic06-BnCQnmx7.png",
			"/assets/pic03-C9sA_m8s.png",
			"/assets/pic04-CxD2NUJX.png",
		],
		alt: "Outdoor Structures",
		contact: "0404 289 437",
		icon: PhoneIcon,
		name: "OutdoorStructures",
	},
	{
		title: "Doors, Stairs & Flooring",
		description:
			"Quality installations for essential home features. We specialize in custom staircases, door installations, and premium flooring solutions that enhance your home's functionality and appeal.",
		images: [
			"/assets/pic09-By9toE8x.png",
			"/assets/pic03-C9sA_m8s.png",
			"/assets/pic04-CxD2NUJX.png",
		],
		alt: "Interior Features",
		contact: "0404 289 437",
		icon: PhoneIcon,
		name: "InteriorFeatures",
	},
	{
		title: "Roofing",
		description:
			"Comprehensive roofing services including repairs, replacements, and maintenance. We ensure your roof provides reliable protection and enhances your home's appearance.",
		images: [
			"/assets/pic07-BEtM9hZS.png",
			"/assets/pic03-C9sA_m8s.png",
			"/assets/pic04-CxD2NUJX.png",
		],
		alt: "Roofing Services",
		contact: "0404 289 437",
		icon: PhoneIcon,
		name: "Roofing",
	},
	{
		title: "Painting",
		description:
			"Professional interior and exterior painting services for a fresh, modern look. Our expert team ensures flawless finishes and lasting results.",
		images: [
			"/assets/pic13-C3BImLY9.png",
			"/assets/pic03-C9sA_m8s.png",
			"/assets/pic04-CxD2NUJX.png",
		],
		alt: "Painting Services",
		contact: "0404 289 437",
		icon: PhoneIcon,
		name: "Painting",
	},
];

function ImageSlider({ images, alt }: { images: string[]; alt: string }) {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const sliderRef = React.useRef<HTMLDivElement>(null);

	const scrollToImage = (index: number) => {
		if (!sliderRef.current) return;
		sliderRef.current.scrollTo({
			left: index * sliderRef.current.offsetWidth,
			behavior: "smooth",
		});
	};

	// Update current index based on scroll position
	React.useEffect(() => {
		const slider = sliderRef.current;
		if (!slider) return;

		const handleScroll = () => {
			const index = Math.round(slider.scrollLeft / slider.offsetWidth);
			setCurrentImageIndex(index);
		};

		slider.addEventListener("scroll", handleScroll);
		return () => slider.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div className="relative group h-full min-h-[300px]">
			<div className="absolute inset-0 overflow-hidden rounded bg-gray-950">
				{/* Swipeable container */}
				<div
					ref={sliderRef}
					className="absolute inset-0 flex snap-x snap-mandatory overflow-x-auto scrollbar-hide"
					style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
				>
					{images.map((image, index) => (
						<div
							key={image}
							className="relative h-full w-full flex-none snap-start snap-always"
						>
							<img
								src={image}
								alt={`${alt} - Image ${index + 1}`}
								className="h-full w-full object-cover"
							/>
							<div className="absolute inset-0 bg-linear-to-b/oklch from-transparent via-transparent to-gray-950/30" />
							<div className="absolute inset-0 bg-black/5" />
						</div>
					))}
				</div>

				{/* Navigation arrows - visible on desktop */}
				<div className="absolute inset-0 hidden items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10 md:flex">
					<button
						onClick={() => scrollToImage(currentImageIndex - 1)}
						className="rounded-full bg-white/10 p-2 text-gray-100 backdrop-blur-sm transition-all hover:bg-white/20"
						aria-label="Previous image"
						disabled={currentImageIndex === 0}
					>
						<ChevronLeftIcon className="h-6 w-6" />
					</button>
					<button
						onClick={() => scrollToImage(currentImageIndex + 1)}
						className="rounded-full bg-white/10 p-2 text-gray-100 backdrop-blur-sm transition-all hover:bg-white/20"
						aria-label="Next image"
						disabled={currentImageIndex === images.length - 1}
					>
						<ChevronRightIcon className="h-6 w-6" />
					</button>
				</div>

				{/* Navigation dots */}
				<div className="absolute bottom-8 md:bottom-4 left-1/2 z-10 flex -translate-x-1/2 space-x-3">
					{images.map((_, index) => (
						<button
							key={index}
							className={`h-2.5 rounded-full transition-all ${
								index === currentImageIndex
									? "w-8 bg-white"
									: "w-2.5 bg-white/40"
							}`}
							onClick={() => scrollToImage(index)}
							aria-label={`Go to image ${index + 1}`}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

const ServiceCard = ({
  service,
  className,
  id,
}: { service: any; className: string; id: string }) => {
  let ref = useRef<HTMLDivElement | null>(null)

  let computeOpacity = useCallback(() => {
    let element = ref.current
    if (!element) return 1

    let rect = element.getBoundingClientRect()
    let windowWidth = window.innerWidth

    if (rect.left < 0) {
      let diff = Math.abs(rect.left)
      let percent = diff / rect.width
      return Math.max(0.5, 1 - percent)
    } else if (rect.right > windowWidth) {
      let diff = rect.right - windowWidth
      let percent = diff / rect.width
      return Math.max(0.5, 1 - percent)
    } else {
      return 1
    }
  }, [ref])

  let opacity = useSpring(computeOpacity(), {
    stiffness: 154,
    damping: 23,
  })

  useLayoutEffect(() => {
    opacity.set(computeOpacity())
  }, [computeOpacity, opacity])

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      className="relative flex aspect-[9/16] w-full shrink-0 snap-start scroll-ml-[var(--scroll-padding)] flex-col justify-end overflow-hidden rounded-3xl p-6 shadow-lg"
    >
      <img
        alt=""
        src={service.images[0]}
        className="absolute inset-0 h-full  w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black from-[calc(7/16*100%)] ring-1 ring-inset ring-gray-950/10 sm:from-25%"
      />
      <div className="relative">
        <h3 className="text-4xl font-semibold text-white">
    
            {service.title}
  
        </h3>
      </div>
    </motion.div>
  )
}

export default function OurServices() {
	return (
		<div className="relative">
			<div className="relative">
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="py-24 md:py-32"
					id="services"
				>
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="mx-auto max-w-2xl text-center">
							<h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight tracking-[-1.43px] font-medium bg-linear-to-r/oklch from-gray-700 via-gray-800 to-gray-900 sm:bg-linear-to-b/oklch md:bg-linear-to-r/oklch bg-clip-text text-gray-800">
								Our Services
							</h2>
							<p className="mt-6 text-[15px] sm:text-[14px] leading-normal text-gray-900 max-lg:text-center">
								We specialize in a wide range of construction and renovation
								services, delivering exceptional results that exceed
								expectations.
							</p>
						</div>

						<div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:mt-16">
							{services.map((service, index) => (
								<div key={index} className="relative">
									<ServiceCard
										service={service}
										className="w-full"
										id={`service-${service.name.toLowerCase()}`}
									/>
								</div>
							))}
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
