
export default function Hero() {

	return (
		<div className="relative isolate overflow-hidden pt-14">
			<div className="absolute inset-0 -z-10 bg-black">
				<img
					src="/assets/kitchen_3-CQTgEjH4.jpeg"
					alt="Modern Kitchen Renovations"
					className="h-full w-full object-cover opacity-50"
				/>
			</div>


			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto min-h-[calc(100vh-3.5rem)] flex flex-col justify-center py-32 sm:py-48 lg:py-56">
					<div className="hidden sm:mb-8 sm:flex sm:justify-center">
						<div className="relative rounded-xl px-4 py-2 text-xs leading-none text-gray-300 ring-1 ring-gray-800 hover:ring-gray-700 bg-black/50 shadow-premium backdrop-blur-xs transition-all duration-300 ease-in-out">
							Call us for a free quote{" "}
							<a
								href="tel:0404289437"
								className="font-semibold text-gray-100 hover:text-gray-300 transition-all duration-300 ease-in-out"
							>
								<span aria-hidden="true" className="absolute inset-0" />
								0404 289 437{" "}
							</a>
						</div>
					</div>

					<div className="relative text-center">
						<h1 className="text-[40px] leading-[44px] tracking-[-1.43px] md:text-[52px] md:leading-[56px] lg:text-[64px] lg:leading-[68px] font-medium bg-linear-to-r/oklch from-white/95 via-white/90 to-white/80 sm:bg-linear-to-b/oklch md:bg-linear-to-r/oklch bg-clip-text text-transparent">
				Building Beyond Expectations
						</h1>
						<p className="mt-4 text-[18px] sm:text-[16px] leading-normal font-semibold text-white">
						Transforming Visions into Reality
						</p>
				
						<div className="mt-10 flex items-center justify-center gap-x-6">
							<a
								href="#contact"
								className="rounded-xl bg-gray-900 px-3.5 py-2.5 text-[13px] leading-none font-semibold text-gray-100 shadow-premium backdrop-blur-xs ring-1 ring-gray-800 hover:bg-gray-800 hover:text-gray-200 hover:ring-gray-700 transition-all duration-300 ease-in-out"
							>
								Get a Quote
							</a>
							<a
								href="#services"
								className="text-[13px] leading-none font-semibold text-gray-100 hover:text-gray-300 transition-all duration-300 ease-in-out"
							>
								Our Services <span aria-hidden="true">→</span>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
