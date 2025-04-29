import { LexicalComposer } from "@lexical/react/LexicalComposer";

interface Props {
  json: string;
}

export default function RichTextRenderer({ json }: Props) {
  return (
    <LexicalComposer
      initialConfig={{
        namespace: "render",
        editorState: (editor: any) => editor.parseEditorState(json),
        onError: console.error,
        editable: false,
      }}
    ></LexicalComposer>
  );
}
