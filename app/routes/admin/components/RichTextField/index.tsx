import { LinkNode } from "@lexical/link"; // Import LinkNode
import { ListItemNode, ListNode } from "@lexical/list"; // Import list nodes
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text"; // Import heading and quote nodes
import type { EditorState, LexicalEditor } from "lexical"; // Import LexicalEditor

import clsx from "clsx";
import React, { type JSX, useCallback, useMemo, useRef } from "react"; 
import LexicalToolbar from "~/routes/admin/components/RichTextField/Toolbar";

/**
 * RichTextField renders a Lexical rich text editor and manages its state.
 *
 * - It does NOT directly update the database.
 * - It serializes the editor state to a JSON string and stores it in a hidden input.
 * - The hidden input's `name` prop (e.g., "about_text") ensures its value is included in the parent form submission.
 * - When the parent <Form> is submitted (either via a standard <Form> or fetcher.submit()), the hidden input's value is sent to the server.
 * - The server-side action function receives this value and performs the database update.
 */
interface Props {
	name: string; // form field key e.g. "about_text"
	initialJSON?: string | null; // value from loader
	disabled?: boolean;
}

export default function RichTextField({
	name,
	initialJSON,
	disabled,
}: Props): JSX.Element {
	/* hidden input so <fetcher.Form> sees the JSON string */
	const inputRef = useRef<HTMLInputElement>(null);

	const handleChange = useCallback((state: EditorState) => {
		/* serialise after every edit */
		if (inputRef.current) {
			inputRef.current.value = JSON.stringify(state.toJSON());
		}
	}, []);

	const initialConfig = useMemo(
		() => ({
			namespace: name,
			onError: console.error,
			// Register the core nodes + list and link nodes
			nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode, LinkNode],
			theme: {
				text: { underline: "underline" }, // Add theme for underline
			},
			editorState: initialJSON
				? (editor: LexicalEditor) => {
						// Use string directly if it's a string, otherwise null/undefined is fine
						const state = editor.parseEditorState(initialJSON);
						editor.setEditorState(state);
					}
				: undefined, // Let Lexical handle default empty state
		}),
		[name, initialJSON],
	);

	return (
		<>
			<input
				ref={inputRef}
				type="hidden"
				name={name}
				value={initialJSON ?? ""}
			/>
			<LexicalComposer initialConfig={initialConfig}>
				{/* Formatting Toolbar for bold, italic, headings, lists, links, etc. */}
				<LexicalToolbar />
				<span
					data-slot="control"
					className={clsx([
						"relative block w-full",
						// Background color + shadow applied to inset pseudo element
						"before:absolute before:inset-px before:rounded-[calc(var(--radius-md)-1px)] before:bg-screen before:shadow-textarea",
						"dark:before:hidden",
						// Focus ring (keeping existing focus style)
						"after:pointer-events-none after:absolute after:inset-0 after:rounded-md after:ring-transparent after:ring-inset sm:focus-within:after:ring-2 sm:focus-within:after:ring-blue-500",
						disabled
							? "opacity-50 before:bg-zinc-950/5 before:shadow-none"
							: undefined,
					])}
				>
					<RichTextPlugin
						contentEditable={
							<ContentEditable
								className={clsx([
									"relative block h-full w-full appearance-none rounded-md px-3 py-2 sm:px-2.5 sm:py-1.5",
									"text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white",
									"bg-transparent",
									"focus:outline-hidden",
									disabled ? "opacity-50 bg-gray-50" : undefined,
								])}
							/>
						}
						placeholder={
							<p className="text-sm text-gray-400 absolute top-3 left-3 pointer-events-none">
								Start typing…
							</p>
						}
						ErrorBoundary={LexicalErrorBoundary}
					/>
				</span>
				<HistoryPlugin />
				<ListPlugin />
				<LinkPlugin />
				<OnChangePlugin onChange={handleChange} />
			</LexicalComposer>
		</>
	);
}
