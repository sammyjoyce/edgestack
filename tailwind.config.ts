import type { Config } from "tailwindcss";

export default {
	content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: [
					'"Inter"',
					"ui-sans-serif",
					"system-ui",
					"sans-serif",
					'"Apple Color Emoji"',
					'"Segoe UI Emoji"',
					'"Segoe UI Symbol"',
					'"Noto Color Emoji"',
				],
			},
			borderRadius: {
				'sm': '2px',
				DEFAULT: '4px',
				'md': '6px',
				'lg': '8px',
			  },
			  colors: {
				primary: {
					50: '#f5f7fa',
					100: '#ebeef3',
					200: '#d2d9e4',
					300: '#a6b4c8',
					400: '#7a8ca8',
					500: '#576c88',
					600: '#435670',
					700: '#364459',
					800: '#2d3848',
					900: '#27303d',
				},
				accent: {
					50: '#fff7ed',
					100: '#ffedd5',
					200: '#fed7aa',
					300: '#fdba74',
					400: '#fb923c',
					500: '#f97316',
					600: '#ea580c',
					700: '#c2410c',
					800: '#9a3412',
					900: '#7c2d12',
				},
				gray: {
					950: '#030712',
					900: '#111827',
					800: '#1f2937',
					700: '#374151',
					600: '#4b5563',
					500: '#6b7280',
					400: '#9ca3af',
					300: '#d1d5db',
					200: '#e5e7eb',
					100: '#f3f4f6',
					50: '#f9fafb',
				}
			},
			boxShadow: {
				'subtle': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
				'premium': '0 0 0 1px rgba(0, 0, 0, 0.05), 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
				'elegant': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
				'float': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
			},
		},
	},
	plugins: [],
} satisfies Config;
