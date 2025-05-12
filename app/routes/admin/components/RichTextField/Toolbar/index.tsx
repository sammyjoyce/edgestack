import {
	ArrowUturnLeftIcon,
	ArrowUturnRightIcon,
	Bars3BottomLeftIcon,
	Bars3BottomRightIcon,
	Bars3Icon,
	BarsArrowDownIcon,
} from "@heroicons/react/20/solid";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import clsx from "clsx";
import {
	$getSelection,
	$isRangeSelection,
	CAN_REDO_COMMAND,
	CAN_UNDO_COMMAND,
	FORMAT_ELEMENT_COMMAND,
	FORMAT_TEXT_COMMAND,
	REDO_COMMAND,
	type TextFormatType,
	UNDO_COMMAND,
} from "lexical";
import React, {
	type JSX,
	type ReactNode,
	useCallback,
	useEffect,
	useState,
} from "react";

function Divider() {
	return <div className="w-px h-5 bg-gray-300 mx-1" />;
}

interface ToolbarButton {
	label: string;
	arg: TextFormatType;
	icon: ReactNode;
}

const TOOLBAR_BUTTONS: ToolbarButton[] = [
	{ label: "Bold", arg: "bold", icon: <b>B</b> },
	{ label: "Italic", arg: "italic", icon: <i>I</i> },
	{ label: "Underline", arg: "underline", icon: <u>U</u> },
	{
		label: "Strikethrough",
		arg: "strikethrough",
		icon: <span className="line-through">S</span>,
	},
];
export default function LexicalToolbar(): JSX.Element {
	const [editor] = useLexicalComposerContext();
	const [canUndo, setCanUndo] = useState(false);
	const [canRedo, setCanRedo] = useState(false);
	const [active, setActive] = useState<
		Partial<Record<TextFormatType, boolean>>
	>({
		bold: false,
		italic: false,
		underline: false,
		strikethrough: false,
	});
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
					});
				}
			});
		});
	}, [editor]);
	useEffect(() => {
		const unregisterUndo = editor.registerCommand(
			CAN_UNDO_COMMAND,
			(payload) => {
				setCanUndo(payload);
				return false;
			},
			1,
		);
		const unregisterRedo = editor.registerCommand(
			CAN_REDO_COMMAND,
			(payload) => {
				setCanRedo(payload);
				return false;
			},
			1,
		);
		return () => {
			unregisterUndo();
			unregisterRedo();
		};
	}, [editor]);
	const format = useCallback(
		(formatType: TextFormatType) => {
			editor.dispatchCommand(FORMAT_TEXT_COMMAND, formatType);
		},
		[editor],
	);
	return (
		<div className="flex gap-1 bg-gray-50 border-b-0 border-admin-border px-2 py-1">
			<button
				type="button"
				disabled={!canUndo}
				onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
				className="px-2 py-0.5 rounded border border-transparent text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
				aria-label="Undo"
			>
				<ArrowUturnLeftIcon className="size-4" />
			</button>
			<button
				type="button"
				disabled={!canRedo}
				onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
				className="px-2 py-0.5 rounded border border-transparent text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
				aria-label="Redo"
			>
				<ArrowUturnRightIcon className="size-4" />
			</button>
			<Divider />
			{TOOLBAR_BUTTONS.map((btn: ToolbarButton) => (
				<button
					key={btn.arg}
					type="button"
					aria-label={btn.label}
					aria-pressed={active[btn.arg] ?? false}
					className={clsx(
						"px-2 py-0.5 rounded border text-xs focus:outline-hidden transition-colors",
						active[btn.arg]
							? "bg-primary text-white border-primary"
							: "border-transparent text-gray-600 hover:bg-gray-200 focus:ring-1 focus:ring-primary",
					)}
					onMouseDown={(e) => {
						e.preventDefault();
						format(btn.arg);
					}}
				>
					{btn.icon}
				</button>
			))}
			<Divider />
			<button
				type="button"
				onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}
				className="px-2 py-0.5 rounded border border-transparent text-gray-600 hover:bg-gray-200"
				aria-label="Left Align"
			>
				<Bars3BottomLeftIcon className="size-4" />
			</button>
			<button
				type="button"
				onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}
				className="px-2 py-0.5 rounded border border-transparent text-gray-600 hover:bg-gray-200"
				aria-label="Center Align"
			>
				<Bars3Icon className="size-4" />
			</button>
			<button
				type="button"
				onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}
				className="px-2 py-0.5 rounded border border-transparent text-gray-600 hover:bg-gray-200"
				aria-label="Right Align"
			>
				<Bars3BottomRightIcon className="size-4" />
			</button>
			<button
				type="button"
				onClick={() =>
					editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")
				}
				className="px-2 py-0.5 rounded border border-transparent text-gray-600 hover:bg-gray-200"
				aria-label="Justify Align"
			>
				<BarsArrowDownIcon className="size-4" />
			</button>
		</div>
	);
}
