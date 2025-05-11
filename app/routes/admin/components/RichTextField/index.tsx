import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import clsx from "clsx";
import type { EditorState, LexicalEditor } from "lexical";
import React, { type JSX, useCallback, useMemo, useRef } from "react";
import LexicalToolbar from "~/routes/admin/components/RichTextField/Toolbar";

interface Props {
	name: string;
	initialJSON?: string | null;
	disabled?: boolean;
	onBlur?: (value: string) => void;
	className?: string;
}

export default function RichTextField({
	name,
	initialJSON,
	disabled,
	onBlur,
	className,
}: Props): JSX.Element {
	const inputRef = useRef<HTMLInputElement>(null);

	const handleChange = useCallback((state: EditorState) => {
		if (inputRef.current) {
			inputRef.current.value = JSON.stringify(state.toJSON());
		}
	}, []);

	const handleBlur = useCallback(() => {
		if (inputRef.current && onBlur) {
			onBlur(inputRef.current.value);
		}
	}, [onBlur]);

	const initialConfig = useMemo(
		() => ({
			namespace: name,
			onError: console.error,
			nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode, LinkNode],
			theme: { text: { underline: "underline" } },
			editorState: initialJSON
				? (editor: LexicalEditor) => {
						const state = editor.parseEditorState(initialJSON);
						editor.setEditorState(state);
					}
				: undefined,
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
				<div
					className={clsx(
						"ring-1 ring-gray-300 dark:ring-zinc-700 rounded-md overflow-hidden",
						"focus-within:ring-2 focus-within:ring-blue-500",
						className,
					)}
				>
					<LexicalToolbar />
					<span
						data-slot="control"
						className={clsx([
							"relative block w-full ring-1 ring-gray-300 rounded-md bg-white dark:ring-zinc-700 focus-within:ring-2 focus-within:ring-blue-500 disabled:opacity-50",
							disabled ? "opacity-50" : undefined,
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
									onBlur={handleBlur}
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
				</div>
			</LexicalComposer>
		</>
	);
}
