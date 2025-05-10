import React from "react";
function BackToTop() {
	return (
		<button
			type="button"
			onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
			className="fixed right-5 bottom-5 z-50 rounded-full bg-gray-900 p-3 text-gray-100 shadow-premium ring-1 ring-gray-800 transition hover:bg-gray-800 hover:text-gray-100 hover:ring-gray-700 focus:bg-gray-800 focus:outline-hidden focus:ring-gray-700 active:bg-gray-800"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth="1.5"
				stroke="currentColor"
				className="h-6 w-6"
				role="img"
				aria-label="back to top"
			>
				<title>Back to top</title>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
				/>
			</svg>
		</button>
	);
}
export default BackToTop;
