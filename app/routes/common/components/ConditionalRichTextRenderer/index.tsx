import type React from "react";
import { type JSX } from "react";
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
		const parsedJson = JSON.parse(text);
		// If successful, pass the parsed object to RichTextRenderer.
		// Using 'as any' to bypass string type for testing if RichTextRenderer handles objects.
		// If this works, RichTextRenderer's props might need adjustment.
		return (
			<RichTextRenderer
				json={parsedJson as any}
				className={richTextClassName}
			/>
		);
	} catch {
		return <FallbackTag className={fallbackClassName}>{text}</FallbackTag>;
	}
}
