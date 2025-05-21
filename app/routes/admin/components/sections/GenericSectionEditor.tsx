import type React from "react";
import type { useFetcher } from "react-router";
import type { ContentInputType, SectionSchema } from "~/section-schema";
import { Alert } from "../ui/alert";
import { Input } from "../ui/input";
import { FieldLabel, SectionCard, SectionHeading } from "../ui/section";
import { Text } from "../ui/text";
import { Textarea } from "../ui/textarea";

interface GenericSectionEditorProps {
	schema: SectionSchema;
	fetcher: ReturnType<typeof useFetcher>;
	initialContent: Record<string, string>;
}

export function GenericSectionEditor({
	schema,
	fetcher,
	initialContent,
}: GenericSectionEditorProps) {
	const actionData = fetcher.data as
		| { error?: string; errors?: Record<string, string> }
		| undefined;

	const handleBlur = (
		e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.currentTarget;
		const formData = new FormData();
		formData.append("intent", "updateTextContent");
		formData.append(name, value);
		fetcher.submit(formData, { method: "post", action: "/admin" });
	};

	const renderField = (
		key: string,
		field: { label: string; inputType: ContentInputType },
	) => {
		const id = key;
		const defaultValue = initialContent[key] || "";
		const error = actionData?.errors?.[key];
		switch (field.inputType) {
			case "richtext":
				return (
					<div key={key} className="flex flex-col gap-1 min-w-0">
						<FieldLabel htmlFor={id}>{field.label}</FieldLabel>
						<Textarea
							id={id}
							name={id}
							defaultValue={defaultValue}
							onBlur={handleBlur}
							rows={4}
						/>
						{error && (
							<Text className="text-sm text-red-600 mt-1">{error}</Text>
						)}
					</div>
				);
			case "image":
				return (
					<div key={key} className="flex flex-col gap-1 min-w-0">
						<FieldLabel>{field.label}</FieldLabel>
						<Input
							type="text"
							name={id}
							defaultValue={defaultValue}
							onBlur={handleBlur}
						/>
						{error && (
							<Text className="text-sm text-red-600 mt-1">{error}</Text>
						)}
					</div>
				);
			default:
				return (
					<div key={key} className="flex flex-col gap-1 min-w-0">
						<FieldLabel htmlFor={id}>{field.label}</FieldLabel>
						<Input
							id={id}
							name={id}
							defaultValue={defaultValue}
							onBlur={handleBlur}
						/>
						{error && (
							<Text className="text-sm text-red-600 mt-1">{error}</Text>
						)}
					</div>
				);
		}
	};

	return (
		<SectionCard>
			{actionData?.error && (
				<Alert variant="error" title="Save failed" className="mb-4">
					{actionData.error}
				</Alert>
			)}
			<SectionHeading>{schema.label} Section</SectionHeading>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-3 sm:gap-x-6">
				{Object.entries(schema.fields).map(([key, field]) =>
					renderField(key, field),
				)}
			</div>
		</SectionCard>
	);
}
