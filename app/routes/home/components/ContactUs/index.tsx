import {
	BuildingOffice2Icon,
	ClockIcon,
	EnvelopeIcon,
	PhoneIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { motion } from "framer-motion";
import React from "react";
import ConditionalRichTextRenderer from "~/routes/common/components/ConditionalRichTextRenderer";
interface ContactUsProps {
	content?: Record<string, string>;
	theme?: "light" | "dark";
}
export default function ContactUs({
	content = {},
	theme = "light",
}: ContactUsProps) {
	const {
		contact_headline: headline = "Ready to Start Your Project?",
		contact_intro:
			intro = "From concept to completion, we're here to help bring your vision to life. Our expert team specializes in turning your ideas into stunning reality.",
		contact_address: address = "PO BOX 821\nMarrickville, NSW 2204",
		contact_phone: phone = "0404 289 437",
		contact_email: email = "contact@lushconstructions.com",
		contact_hours:
			hours = "Monday - Friday: 7am - 5pm\nSaturday: By appointment",
		contact_abn: abn = "99 652 947 528",
		contact_acn: acn = "141 565 746",
		contact_license: license = "4632530",
		contact_instagram:
			instagram = "https://www.instagram.com/lushconstructions",
	} = content;
	return (
		<motion.div
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			viewport={{ once: true }}
			transition={{ duration: 0.8 }}
			className={clsx(
				"relative isolate overflow-hidden py-24 sm:py-32 bg-black text-white dark:bg-gray-900 dark:text-white",
				theme === "dark" && "dark",
			)}
			id="contact"
		>
			<div className="-z-10 absolute inset-0 overflow-hidden">
				<div
					aria-hidden="true"
					className="-top-40 -right-20 absolute transform-gpu blur-3xl"
				>
					<div
						style={{
							clipPath:
								"polygon(74.1% 56.1%, 100% 38.6%, 97.5% 73.3%, 85.5% 100%, 80.7% 98.2%, 72.5% 67.7%, 60.2% 37.8%, 52.4% 32.2%, 47.5% 41.9%, 45.2% 65.8%, 27.5% 23.5%, 0.1% 35.4%, 17.9% 0.1%, 27.6% 23.5%, 76.1% 2.6%, 74.1% 56.1%)",
						}}
						className={clsx(
							"aspect-1155/678 w-xl opacity-20 bg-linear-to-br/oklch from-gray-800/20 to-gray-700/20 dark:from-gray-700/20 dark:to-gray-600/20",
						)}
					/>
				</div>
			</div>
			<div className="mx-auto max-w-6xl px-6 lg:px-8">
				<div className="mx-auto max-w-2xl text-white dark:text-gray-100">
					<h2 className="sr-only">Contact us</h2>
					<p
						className={clsx(
							"bg-clip-text font-medium text-4xl text-transparent leading-tight tracking-[-1.43px] text-balance",
							"bg-linear-to-r/oklch from-white via-white/80 to-gray-300/50 dark:from-gray-100 dark:via-gray-200/80 dark:to-gray-300/50",
						)}
					>
						{headline}
					</p>
					<ConditionalRichTextRenderer
						text={intro}
						fallbackClassName={clsx(
							"mt-6 text-[15px] leading-normal",
							"text-gray-300 dark:text-gray-300",
						)}
						richTextClassName={clsx(theme === "dark" && "dark:prose-invert")}
					/>
					<dl
						className={clsx(
							"mt-10 space-y-4 text-[15px] leading-normal",
							"text-gray-300 dark:text-gray-300",
						)}
					>
						<div className="flex items-center gap-x-4">
							<dt className="flex-none">
								<span className="sr-only">Address</span>
								<BuildingOffice2Icon
									className="h-6 w-6 text-gray-400 dark:text-gray-300"
									aria-hidden="true"
								/>
							</dt>
							<dd className="whitespace-pre-line">{address}</dd>
						</div>
						<div className="flex items-center gap-x-4">
							<dt className="flex-none">
								<span className="sr-only">Telephone</span>
								<PhoneIcon
									className="h-6 w-6 text-gray-400 dark:text-gray-300"
									aria-hidden="true"
								/>
							</dt>
							<dd>
								<a
									href={`tel:${phone.replace(/\s/g, "")}`}
									className="transition-all duration-300 ease-in-out hover:text-white dark:hover:text-gray-100"
								>
									{phone}
								</a>
							</dd>
						</div>
						<div className="flex items-center gap-x-4">
							<dt className="flex-none">
								<span className="sr-only">Email</span>
								<EnvelopeIcon
									className="h-6 w-6 text-gray-400 dark:text-gray-300"
									aria-hidden="true"
								/>
							</dt>
							<dd>
								<a
									href={`mailto:${email}`}
									className="transition-all duration-300 ease-in-out hover:text-white dark:hover:text-gray-100"
								>
									{email}
								</a>
							</dd>
						</div>
						<div className="flex items-center gap-x-4">
							<dt className="flex-none">
								<span className="sr-only">Hours</span>
								<ClockIcon
									className="h-6 w-6 text-gray-400 dark:text-gray-300"
									aria-hidden="true"
								/>
							</dt>
							<dd className="whitespace-pre-line">{hours}</dd>
						</div>
					</dl>
					<div
						className={clsx(
							"mt-8 space-y-1 text-[11px] leading-normal",
							"text-gray-400 dark:text-gray-400",
						)}
					>
						<p className="font-medium whitespace-pre-line">ABN: {abn}</p>
						<p className="font-medium whitespace-pre-line">ACN: {acn}</p>
						<p className="font-medium whitespace-pre-line">
							License Number: {license}
						</p>
					</div>
					<div className="mt-10">
						<h3
							className={clsx(
								"font-semibold text-[15px] leading-normal",
								"text-white dark:text-gray-100",
							)}
						>
							Follow Us
						</h3>
						<ul className="mt-4 flex gap-3">
							<li>
								<a
									href={instagram}
									target="_blank"
									rel="noopener noreferrer"
									className={clsx(
										"flex h-10 w-10 items-center justify-center rounded-md border transition-all duration-300 ease-in-out",
										"border-gray-700 text-gray-400 hover:border-gray-600 hover:bg-gray-900/50 hover:text-white dark:border-gray-600 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-700/50 dark:hover:text-white",
									)}
								>
									<span className="sr-only">Instagram</span>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 448 512"
										className="h-5 w-5"
										aria-hidden="true"
									>
										<path
											fill="currentColor"
											d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
										/>
									</svg>
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
