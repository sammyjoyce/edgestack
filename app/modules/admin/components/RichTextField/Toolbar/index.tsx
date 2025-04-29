import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import {$getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, type TextFormatType} from "lexical";
import clsx from "clsx";
import React, {type JSX, useCallback, useEffect, useState} from "react";

interface ToolbarButton {
  label: string;
  arg: TextFormatType;
  icon: React.ReactNode;
}

const TOOLBAR_BUTTONS: ToolbarButton[] = [
  { label: "Bold", arg: "bold", icon: <b>B</b> },
  { label: "Italic", arg: "italic", icon: <i>I</i> },
  { label: "Underline", arg: "underline", icon: <u>U</u> },
];

export default function LexicalToolbar(): JSX.Element {
  const [editor] = useLexicalComposerContext();

  const [active, setActive] = useState<Partial<Record<TextFormatType, boolean>>>({
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
    [editor]
  );

  // Styled toolbar for rich text formatting
  return (
    <div className="flex gap-2 bg-white border shadow-sm rounded-md px-2 py-1 mb-2">
      {TOOLBAR_BUTTONS.map((btn: ToolbarButton) => (
        <button
          key={btn.arg}
          type="button"
          aria-label={btn.label}
          aria-pressed={active[btn.arg] ?? false}
          className={clsx(
            "px-2 py-1 rounded border text-sm focus:outline-hidden transition-colors",
            active[btn.arg]
              ? "bg-indigo-600 text-white border-indigo-600"
              : "border-gray-200 text-gray-700 hover:bg-indigo-50 focus:ring-2 focus:ring-indigo-500"
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
