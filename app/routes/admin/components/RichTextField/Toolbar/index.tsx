import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import clsx from "clsx";
import {
	$getSelection,
	$isRangeSelection,
	FORMAT_TEXT_COMMAND,
	type TextFormatType,
} from "lexical";
import { type JSX, type ReactNode, useCallback, useEffect, useState } from "react";

interface ToolbarButton {
	label: string;
	arg: TextFormatType;
	icon: ReactNode;
}

const TOOLBAR_BUTTONS: ToolbarButton[] = [
	{ label: "Bold", arg: "bold", icon: <b>B</b> },
	{ label: "Italic", arg: "italic", icon: <i>I</i> },
	{ label: "Underline", arg: "underline", icon: <u>U</u> },
];

export default function LexicalToolbar(): JSX.Element {
	const [editor] = useLexicalComposerContext();

	const [active, setActive] = useState<
		Partial<Record<TextFormatType, boolean>>
	>({
		bold: false,
		italic: false,
		underline: false,
		strikethrough: false,
		code: false,
	});

	// keep state in sync with the editor selection
	useEffect(() => {
		return editor.registerUpdateListener(({ editorState }) => {
			editorState.read(() => {
				const sel = $getSelection();
				if ($isRangeSelection(sel)) {
					setActive({
						bold: sel.hasFormat("bold"),
						italic: sel.hasFormat("italic"),
						underline: sel.hasFormat("underline"),
						strikethrough: sel.hasFormat("strikethrough"),
						code: sel.hasFormat("code"),
					});
				}
			});
		});
	}, [editor]);

	const format = useCallback(
		(formatType: TextFormatType) => {
			editor.dispatchCommand(FORMAT_TEXT_COMMAND, formatType);
		},
		[editor],
	);

	// Styled toolbar for rich text formatting
	return (
		<div className="flex gap-1 bg-gray-50 border border-b-0 border-gray-300 rounded-t-md px-2 py-1">
			{" "}
			{/* Adjusted bg, border, gap, padding */}
			{TOOLBAR_BUTTONS.map((btn: ToolbarButton) => (
				<button
					key={btn.arg}
					type="button"
					aria-label={btn.label}
					aria-pressed={active[btn.arg] ?? false}
					className={clsx(
						"px-2 py-0.5 rounded border text-xs focus:outline-hidden transition-colors" /* Adjusted padding/size */,
						active[btn.arg]
							? "bg-blue-600 text-white border-blue-600" /* Adjusted colors */
							: "border-transparent text-gray-600 hover:bg-gray-200 focus:ring-1 focus:ring-blue-500" /* Adjusted colors/focus */,
					)}
					onMouseDown={(e) => {
						e.preventDefault();
						format(btn.arg);
					}}
				>
					{btn.icon}
				</button>
			))}
		</div>
	);
}
