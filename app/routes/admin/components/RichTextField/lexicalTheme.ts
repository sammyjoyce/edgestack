// Tailwind + Lexical theme mapping
import type { Theme } from "@lexical/react/LexicalComposer";

export const lexicalTheme = {
	paragraph: "mb-4 leading-relaxed text-slate-800 dark:text-slate-200",
	heading: {
		h1: "text-4xl font-bold md:text-5xl tracking-tight mb-4",
		h2: "text-3xl font-bold md:text-4xl tracking-tight mb-3",
		h3: "text-2xl font-semibold md:text-3xl tracking-tight mb-2",
		h4: "text-xl font-semibold mb-2",
		h5: "text-lg font-semibold mb-1",
		h6: "text-base font-semibold mb-1",
	},
	list: {
		ul: "list-disc pl-6 my-4",
		ol: "list-decimal pl-6 my-4",
		listitem: "mb-1",
	},
	link: "text-primary-600 underline underline-offset-2 hover:text-primary-700",
	text: {
		underline: "underline",
	},
	code:
		"font-mono text-sm rounded px-1.5 py-1 bg-slate-100 dark:bg-slate-800 " +
		"text-pink-700 dark:text-pink-400",
	codeHighlight: {
		comment: "text-slate-500 italic",
		keyword: "text-cyan-600 dark:text-cyan-400",
		string: "text-amber-700 dark:text-amber-300",
	},
} satisfies Theme;
