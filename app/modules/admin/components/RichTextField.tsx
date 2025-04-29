import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
// Heading support can be added via custom commands or plugins if needed.
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import type { EditorState } from "@common/utils/lexical";
import { useRef } from "react";
import LexicalToolbar from "./LexicalToolbar";

interface Props {
  name: string; // form field key e.g. "about_text"
  initialJSON?: string | null; // value from loader
  disabled?: boolean;
}

export default function RichTextField({ name, initialJSON, disabled }: Props) {
  /* hidden input so <fetcher.Form> sees the JSON string */
  const inputRef = useRef<HTMLInputElement>(null);

  const initialConfig = {
    namespace: name,
    onError: console.error,
    editorState() {
      if (initialJSON) {
        return (editor: any) => editor.parseEditorState(initialJSON as any); // deserialise
      }
    },
  };

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
        {/* Heading support can be added here with a custom plugin if needed */}
        <OnChangePlugin
          onChange={(state: EditorState) => {
            /* serialise after every edit */
            inputRef.current!.value = JSON.stringify(state.toJSON());
          }}
        />
      </LexicalComposer>
    </>
  );
}
