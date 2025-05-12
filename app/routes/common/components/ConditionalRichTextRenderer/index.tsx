import type React from "react";
import type { JSX } from "react";
import RichTextRenderer from "~/routes/common/components/RichTextRenderer";

interface ConditionalRichTextRendererProps {
	text: string | undefined | null;
	fallbackClassName?: string;
	richTextClassName?: string;
	fallbackTag?: keyof React.JSX.IntrinsicElements;
}

export function ConditionalRichTextRenderer({
	text,
	fallbackClassName = "text-base sm:text-lg",
	richTextClassName,
	fallbackTag: FallbackTag = "p",
}: ConditionalRichTextRendererProps): JSX.Element | null {
	if (!text) {
		return null;
	}
	try {
		// Attempt to parse the text as JSON
		JSON.parse(text); // Verify it's valid JSON, but we don't need the parsed object here.
		// If successful, pass the ORIGINAL text string to RichTextRenderer.
		return (
			<RichTextRenderer
				json={text} // Pass the original string 'text'
				className={richTextClassName}
			/>
		);
	} catch {
		// Fallback to rendering plain text with standard Tailwind classes
		return <FallbackTag className={fallbackClassName}>{text}</FallbackTag>;
	}
}
