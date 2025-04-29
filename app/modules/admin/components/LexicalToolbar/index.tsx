import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND } from "@common/utils/lexical";
import type { TextFormatType } from "@common/utils/lexical";
import { useCallback } from "react";

const TOOLBAR_BUTTONS: {
  label: string;
  arg: TextFormatType;
  icon: React.ReactNode;
}[] = [
  { label: "Bold", arg: "bold", icon: <b>B</b> },
  { label: "Italic", arg: "italic", icon: <i>I</i> },
  { label: "Underline", arg: "underline", icon: <u>U</u> },
  // Add more buttons for lists, headings, links, etc.
];

export default function LexicalToolbar() {
  const [editor] = useLexicalComposerContext();

  const format = useCallback(
    (formatType: TextFormatType) => {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, formatType);
    },
    [editor]
  );

  // Styled toolbar for rich text formatting
  return (
    <div className="flex gap-2 bg-white border shadow-sm rounded-md px-2 py-1 mb-2">
      {TOOLBAR_BUTTONS.map(
        (btn: {
          label: string;
          arg: TextFormatType;
          icon: React.ReactNode;
        }) => (
          <button
            key={btn.arg}
            type="button"
            aria-label={btn.label}
            className="px-2 py-1 rounded border border-gray-200 text-gray-700 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            onMouseDown={(e) => {
              e.preventDefault();
              format(btn.arg);
            }}
          >
            {btn.icon}
          </button>
        )
      )}
      {/* Add more buttons for lists, headings, links, etc. */}
    </div>
  );
}
