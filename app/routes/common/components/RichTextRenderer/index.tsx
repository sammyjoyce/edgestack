import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";

interface Props {
	json: string;
	className?: string; // Allow passing className for styling
}

// Basic read-only renderer for Lexical JSON state
export default function RichTextRenderer({ json, className }: Props) {
	return (
		<LexicalComposer
			initialConfig={{
				namespace: "render",
				editorState: (editor: any) => editor.parseEditorState(json),
				onError: console.error,
				editable: false, // Read-only
				nodes: [], // Add custom nodes if needed
				theme: {
					// Add basic theme styles if needed, or rely on parent styling/prose
					paragraph: className || "mb-4", // Example: Add bottom margin to paragraphs
					// Add other element styles as required
				},
			}}
		>
			<div className="relative">
				{" "}
				{/* Needed for positioning placeholder if used */}
				<RichTextPlugin
					contentEditable={
						// Use a simple div for read-only display
						<ContentEditable className="outline-hidden" readOnly={true} />
					}
					// Placeholder component is optional for read-only
					placeholder={null}
					ErrorBoundary={LexicalErrorBoundary}
				/>
			</div>
		</LexicalComposer>
	);
}
