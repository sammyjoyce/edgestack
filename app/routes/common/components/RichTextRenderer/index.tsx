import clsx from "clsx";
import type {
	SerializedEditorState,
	SerializedLexicalNode,
	SerializedTextNode,
} from "lexical";
import type React from "react";
import { Fragment } from "react";

interface SerializedHeadingNode extends SerializedLexicalNode {
	tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	children: SerializedLexicalNode[];
}

interface SerializedLinkNode extends SerializedLexicalNode {
	url: string;
	target?: string;
	rel?: string;
	children: SerializedLexicalNode[];
}

interface SerializedListItemNode extends SerializedLexicalNode {
	value: number;
	children: SerializedLexicalNode[];
}

interface SerializedListNode extends SerializedLexicalNode {
	listType: "bullet" | "number" | "check";
	tag: "ul" | "ol";
	children: SerializedLexicalNode[];
}

interface Props {
	json: string;
	className?: string;
}

function applyTextFormat(
	format: number,
	children: React.ReactNode,
): React.ReactNode {
	let element = children;
	if (format & 1) {
		element = <strong>{element}</strong>;
	}
	if (format & 2) {
		element = <em>{element}</em>;
	}
	if (format & 8) {
		element = <u>{element}</u>;
	}
	return element;
}

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
			const Tag = headingNode.tag;
			return <Tag key={key}>{children}</Tag>;
		}
		case "list": {
			const listNode = node as SerializedListNode;
			const Tag = listNode.tag;
			return <Tag key={key}>{children}</Tag>;
		}
		case "listitem": {
			return <li key={key}>{children}</li>;
		}
		case "link": {
			const linkNode = node as SerializedLinkNode;
			return (
				<a
					key={key}
					href={linkNode.url}
					target={linkNode.target || "_blank"}
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
		default:
			return "children" in node ? (
				<Fragment key={key}>{children}</Fragment>
			) : null;
	}
}

export default function RichTextRenderer({ json, className }: Props) {
	let parsedState: SerializedEditorState | null = null;
	let error = null;
	try {
		parsedState = JSON.parse(json) as SerializedEditorState;
	} catch (e) {
		console.error("Failed to parse Lexical JSON:", e);
		error = "Invalid content format.";
	}
	if (error || !parsedState || !parsedState.root) {
		return (
			<div
				className={clsx(
					className,
				)}
			>
				{" "}
				{}
				{error ? <p className="text-red-500">{error}</p> : null}
			</div>
		);
	}
	return (
		<div
			className={clsx(className)}
		>
			{" "}
			{}
			{renderNode(parsedState.root, 0)}
		</div>
	);
}
