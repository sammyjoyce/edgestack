import React, { Fragment } from "react";
import type {
	SerializedEditorState,
	SerializedLexicalNode,
	SerializedTextNode,
	SerializedLinkNode,
	SerializedHeadingNode,
	SerializedListNode,
	SerializedListItemNode,
} from "lexical";
import clsx from "clsx";
// Optional: If you want to render internal links using react-router
// import { Link as RouterLink } from "react-router-dom";

interface Props {
	json: string;
	className?: string; // Allow passing className for styling
}

// Helper to apply text formatting
function applyTextFormat(
	format: number,
	children: React.ReactNode,
): React.ReactNode {
	let element = children;
	if (format & 1) {
		// BOLD
		element = <strong>{element}</strong>;
	}
	if (format & 2) {
		// ITALIC
		element = <em>{element}</em>;
	}
	if (format & 8) {
		// UNDERLINE
		element = <u>{element}</u>;
	}
	// Add other formats like strikethrough (4), code (16), etc. if needed
	return element;
}

// Recursive function to render Lexical nodes
function renderNode(node: SerializedLexicalNode, key: number): React.ReactNode {
	if (!node) return null;

	const children =
		"children" in node && Array.isArray(node.children)
			? node.children.map((child, index) => renderNode(child, index))
			: null;

	switch (node.type) {
		case "root":
			return <Fragment key={key}>{children}</Fragment>;
		case "paragraph":
			return <p key={key}>{children}</p>;
		case "heading": {
			const headingNode = node as SerializedHeadingNode;
			const Tag = headingNode.tag; // h1, h2, etc.
			return <Tag key={key}>{children}</Tag>;
		}
		case "list": {
			const listNode = node as SerializedListNode;
			const Tag = listNode.tag; // ul, ol
			return <Tag key={key}>{children}</Tag>;
		}
		case "listitem": {
			// const listItemNode = node as SerializedListItemNode; // Not needed currently
			// Lexical list items might have nested lists, handle children appropriately
			return <li key={key}>{children}</li>;
		}
		case "link": {
			const linkNode = node as SerializedLinkNode;
			// Basic link rendering. Enhance with internal link detection if needed.
			// Example: Check if linkNode.url starts with '/' for internal links
			// const isInternal = linkNode.url?.startsWith('/');
			// if (isInternal) {
			//   return <RouterLink key={key} to={linkNode.url}>{children}</RouterLink>;
			// }
			return (
				<a
					key={key}
					href={linkNode.url}
					target={linkNode.target || "_blank"} // Default to _blank for external links
					rel={linkNode.rel || "noopener noreferrer"}
				>
					{children}
				</a>
			);
		}
		case "text": {
			const textNode = node as SerializedTextNode;
			return (
				<Fragment key={key}>
					{applyTextFormat(textNode.format, textNode.text)}
				</Fragment>
			);
		}
		case "linebreak":
			return <br key={key} />;
		// Add cases for other node types (e.g., 'image', 'quote', 'code') if needed
		default:
			// Optionally log unhandled node types
			// console.warn("Unhandled Lexical node type:", node.type);
			// Render children for unknown block-level nodes, or null for unknown inline nodes
			return "children" in node ? <Fragment key={key}>{children}</Fragment> : null;
	}
}

// Basic read-only renderer for Lexical JSON state
export default function RichTextRenderer({ json, className }: Props) {
	let parsedState: SerializedEditorState | null = null;
	let error = null;

	try {
		parsedState = JSON.parse(json) as SerializedEditorState;
	} catch (e) {
		console.error("Failed to parse Lexical JSON:", e);
		error = "Invalid content format.";
		// Optionally render an error message
		// return <div className={clsx("text-red-600", className)}>Error: Invalid content format.</div>;
	}

	if (error || !parsedState || !parsedState.root) {
		// Render nothing or an error message if parsing failed or content is empty
		return (
			<div className={clsx("prose prose-sm max-w-none", className)}>
				{error ? <p className="text-red-500">{error}</p> : null}
			</div>
		);
	}

	return (
		// Apply prose for default styling, allow override/extension with className
		<div className={clsx("prose prose-sm max-w-none", className)}>
			{renderNode(parsedState.root, 0)}
		</div>
	);
}
