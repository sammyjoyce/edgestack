import clsx from "clsx";
import type React from "react";
import { Fragment, type JSX } from "react";
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
		JSON.parse(text);
		return <RichTextRenderer json={text} className={richTextClassName} />;
	} catch {
		return <FallbackTag className={fallbackClassName}>{text}</FallbackTag>;
	}
}
