import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { LinkNode } from "@lexical/link"; // Import LinkNode
import { ListItemNode, ListNode } from "@lexical/list"; // Import list nodes
import type {
  EditorState,
  LexicalEditor,
  SerializedEditorState,
} from "lexical"; // Import LexicalEditor and SerializedEditorState

import React, { useRef, useCallback, useMemo } from "react";
import LexicalToolbar from "app/modules/admin/components/RichTextField/Toolbar";

interface Props {
  name: string; // form field key e.g. "about_text"
  initialJSON?: string | null; // value from loader
  disabled?: boolean;
}

export default function RichTextField({
  name,
  initialJSON,
  disabled,
}: Props): React.ReactElement {
  // Use React.ReactElement
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
      nodes: [ListNode, ListItemNode, LinkNode], // Register the nodes
      editorState: initialJSON
        ? (editor: LexicalEditor) => {
            // Use string directly if it's a string, otherwise null/undefined is fine
            const state = editor.parseEditorState(initialJSON);
            editor.setEditorState(state);
          }
        : undefined, // Let Lexical handle default empty state
    }),
    [name, initialJSON]
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
        <div className="relative">
          {" "}
          {/* Wrapper for placeholder positioning */}
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={`prose prose-sm max-w-none min-h-[8rem] border border-gray-300 rounded-b-md rounded-tr-md p-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white ${
                  /* Adjusted prose size, border, focus, bg */
                  disabled ? "opacity-50 bg-gray-50" : ""
                }`}
              />
            }
            placeholder={
              <p className="text-sm text-gray-400 absolute top-3 left-3 pointer-events-none">
                {" "}
                {/* Placeholder styling */}
                Start typing…
              </p>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
        <OnChangePlugin onChange={handleChange} />
      </LexicalComposer>
    </>
  );
}
