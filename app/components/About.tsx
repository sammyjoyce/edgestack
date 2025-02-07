import { motion } from "framer-motion";


export default function AboutUs() {
	return (
		<div className="relative">
			{/* Decorative background */}
			<div className="absolute inset-0 pointer-events-none">
				<div className="absolute inset-y-0 right-0 w-full">
					<svg
						className="h-full w-full stroke-gray-800/40 [mask-image:radial-gradient(100%_100%_at_top_left,white,transparent)]"
						aria-hidden="true"
					>
						<defs>
							<pattern
								id="about-pattern"
								width="200"
								height="200"
								patternUnits="userSpaceOnUse"
							>
								<path d="M.5 200V.5H200" fill="none" />
							</pattern>
						</defs>
						<rect
							width="100%"
							height="100%"
							strokeWidth="1"
							fill="url(#about-pattern)"
						/>
					</svg>
				</div>
			</div>
			<div className="relative">
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
					className="py-16 sm:py-24 md:py-32"
					id="about"
				>
					<div className="mx-auto grid max-w-7xl grid-cols-1 gap-20 px-6 lg:px-8 xl:grid-cols-5">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="mx-auto xl:col-span-2 max-w-2xl lg:mx-0"
						>
							<h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight tracking-[-1.43px] font-medium bg-linear-to-r/oklch from-white via-white/80 to-gray-300/50 sm:bg-linear-to-b/oklch md:bg-linear-to-r/oklch bg-clip-text text-transparent">
								About Us
							</h2>
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.4 }}
							>
								<p className="mt-6 text-[15px] sm:text-[14px] leading-normal text-gray-300">
									Are you searching for a professional builder who will listen and value your individuality to translate your dreams into a stunning reality?
								</p>
								<p className="mt-4 text-[15px] sm:text-[14px] leading-normal text-gray-300">
									Well look no further, the LUSH solution is what you’ve been looking for!
								</p>
								<p className="mt-4 text-[15px] sm:text-[14px] leading-normal text-gray-300">
									The team at Lush Constructions has a great depth of experience and industry knowledge.
								</p>
								<p className="mt-4 text-[15px] sm:text-[14px] leading-normal text-gray-300">
									Whether you're in the Hills, West Sydney, North West Sydney, or the greater Sydney area, we have you covered with our professional services near you.
								</p>
							</motion.div>
						</motion.div>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
