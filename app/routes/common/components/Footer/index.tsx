import { motion } from "framer-motion";
import type React from "react"; 
import { type JSX, useMemo } from "react";
const navigation = [
	{
		services: [
			{
				name: "Renovations",
				href: "#service-renovations",
			},
			{
				name: "Extensions",
				href: "#service-extensions",
			},
			{
				name: "New Builds",
				href: "#service-new-builds",
			},
			{
				name: "Commercial",
				href: "#service-commercial",
			},
		],
		company: [
			{ name: "Home", href: "#hero" },
			{ name: "About", href: "#about" },
			{ name: "Contact Us", href: "#contact" },
		],
		social: [
			{
				name: "Instagram",
				href: "https://www.instagram.com/lushconstructions/",
				icon: (props: React.SVGProps<SVGSVGElement>) => (
					<svg
						fill="currentColor"
						viewBox="0 0 24 24"
						{...props}
						role="img"
						aria-label="Instagram"
					>
						<title>Instagram</title>
						<path
							fillRule="evenodd"
							d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
							clipRule="evenodd"
						/>
					</svg>
				),
			},
		],
	},
];
const socialLinks = navigation[0].social;
export default function Footer(): JSX.Element {
	const currentYear = useMemo(() => new Date().getFullYear(), []);
	return (
		<motion.footer
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			viewport={{ once: true }}
			transition={{ duration: 0.8 }}
			className="relative"
			aria-labelledby="footer-heading"
		>
			<h2 id="footer-heading" className="sr-only">
				Footer
			</h2>
			<div className="mx-auto max-w-7xl px-6 pt-12 pb-8 sm:pt-16 md:pt-24 lg:px-8">
				<div className="flex flex-col xl:grid xl:grid-cols-3 xl:gap-8">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="mb-10 space-y-6 sm:space-y-8 xl:mb-0"
					>
						<img
							className="h-14 w-auto sm:h-16"
							src="/assets/logo_284x137-KoakP1Oi.png"
							alt="LUSH CONSTRUCTIONS"
						/>
						<p className="max-w-sm text-[15px] text-gray-300 leading-normal sm:text-[14px]">
							Building dreams into reality with expert craftsmanship and
							dedication to quality.
						</p>
						<div className="flex space-x-6">
							{socialLinks.map((item) => (
								<a
									key={item.name}
									href={item.href}
									target="_blank" 
									rel="noopener noreferrer" 
									className="rounded-full p-1.5 text-gray-400 transition-all duration-300 ease-in-out hover:inset-shadow-sm hover:inset-shadow-white/5 hover:bg-gray-900/50 hover:text-gray-100"
								>
									<span className="sr-only">{item.name}</span>
									<item.icon className="h-6 w-6" aria-hidden="true" />
								</a>
							))}
						</div>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="grid grid-cols-2 gap-x-8 gap-y-10 xl:col-span-2"
					>
						<div className="md:grid md:grid-cols-2 md:gap-8">
							<div>
								<h3 className="font-semibold text-[13px] text-gray-100 leading-tight">
									Services
								</h3>
								<ul className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
									{navigation[0].services.map((item) => (
										<li key={item.name}>
											<a
												href={item.href}
												className="-mx-2 rounded px-2 py-1 text-[13px] text-gray-300 leading-tight transition-all duration-300 ease-in-out hover:inset-shadow-sm hover:inset-shadow-white/5 hover:bg-gray-900/50 hover:text-gray-100"
											>
												{item.name}
											</a>
										</li>
									))}
								</ul>
							</div>
							<div className="mt-10 md:mt-0">
								<h3 className="font-semibold text-[13px] text-gray-100 leading-tight">
									Company
								</h3>
								<ul className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
									{navigation[0].company.map((item) => (
										<li key={item.name}>
											<a
												href={item.href}
												className="-mx-2 rounded px-2 py-1 text-[13px] text-gray-300 leading-tight transition-all duration-300 ease-in-out hover:inset-shadow-sm hover:inset-shadow-white/5 hover:bg-gray-900/50 hover:text-gray-100"
											>
												{item.name}
											</a>
										</li>
									))}
								</ul>
							</div>
						</div>
						<div className="md:grid md:gap-8">
							<div>
								<h3 className="font-semibold text-[13px] text-gray-100 leading-tight">
									Contact
								</h3>
								<ul className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
									<li>
										<a
											href="tel:0404289437" 
											className="-mx-2 rounded px-2 py-1 text-[13px] text-gray-300 leading-tight transition-all duration-300 ease-in-out hover:inset-shadow-sm hover:inset-shadow-white/5 hover:bg-gray-900/50 hover:text-gray-100"
										>
											0404 289 437
										</a>
									</li>
									<li className="max-w-[200px] sm:max-w-full">
										<a
											href="mailto:info@lushconstructions.com.au" 
											className="-mx-2 block overflow-hidden truncate rounded px-2 py-1 text-[13px] text-gray-300 leading-tight transition-all duration-300 ease-in-out hover:inset-shadow-sm hover:inset-shadow-white/5 hover:bg-gray-900/50 hover:text-gray-100"
										>
											info@lushconstructions.com.au
										</a>
									</li>
									<li>
										<p className="text-[13px] text-gray-300 leading-tight">
											Sydney, NSW
										</p>
									</li>
								</ul>
							</div>
						</div>
					</motion.div>
				</div>
				<div className="mt-8 border-gray-800 border-t pt-8 md:flex md:items-center md:justify-between">
					<p className="text-[11px] text-gray-400 leading-relaxed">
						&copy; {currentYear} Lush Constructions. All rights reserved.
						<br />
						NSW Builder License: 4632530
					</p>
				</div>
			</div>
		</motion.footer>
	);
}
