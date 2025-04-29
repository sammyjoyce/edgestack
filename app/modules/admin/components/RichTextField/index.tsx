import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
// Heading support can be added via custom commands or plugins if needed.
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import type { EditorState } from "lexical";

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
      editorState() {
        if (initialJSON) {
          return (editor: any) => editor.parseEditorState(initialJSON as any);
        }
      },
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
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className={`prose min-h-[8rem] border rounded p-3 ${
                disabled ? "opacity-50" : ""
              }`}
            />
          }
          placeholder={<p className="text-gray-400">Start typing…</p>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
        <OnChangePlugin onChange={handleChange} />
      </LexicalComposer>
    </>
  );
}