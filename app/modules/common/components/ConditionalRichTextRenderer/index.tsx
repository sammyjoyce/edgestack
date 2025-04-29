import React from "react";
import RichTextRenderer from "~/modules/common/components/RichTextRenderer";

import type React from "react"; // Import React namespace for JSX types

interface ConditionalRichTextRendererProps {
  text: string | undefined | null;
  fallbackClassName?: string;
  richTextClassName?: string;
  fallbackTag?: keyof React.JSX.IntrinsicElements; // Changed to React.JSX
}

/**
 * Renders text using RichTextRenderer if it's valid JSON,
 * otherwise renders it as plain text within a specified tag (defaulting to <p>).
 */
export default function ConditionalRichTextRenderer({
  text,
  fallbackClassName = "text-base sm:text-lg", // Default fallback style
  richTextClassName, // Optional class for RichTextRenderer container
  fallbackTag: FallbackTag = "p", // Default to <p> tag
}: ConditionalRichTextRendererProps): React.JSX.Element | null { // Changed to React.JSX.Element
  if (!text) {
    return null; // Render nothing if text is empty or null/undefined
  }

  try {
    JSON.parse(text); // Attempt to parse as JSON
    // If successful, render using RichTextRenderer
    return <RichTextRenderer json={text} className={richTextClassName} />;
  } catch {
    // If parsing fails, render as plain text within the specified tag
    return <FallbackTag className={fallbackClassName}>{text}</FallbackTag>;
  }
}
