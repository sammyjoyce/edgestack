import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { FetcherWithComponents } from "react-router";
import { ValiError } from "valibot";
import { validateContentInsert } from "../../../../database/valibot-validation.js";
type ActionResponseData = {
	success?: boolean;
	error?: string;
	message?: string;
	errors?: Record<string, string>;
};
const validateField = (
	key: string,
	value: string,
	isRichText: boolean,
): string | null => {
	if (isRichText) return null;
	try {
		if (!key) return "Field key is missing.";
		validateContentInsert({
			key,
			value,
			page: "home",
			section: "dynamic",
			type: "text",
		});
		return null;
	} catch (err: unknown) {
		if (err instanceof ValiError && err.issues.length > 0) {
			return err.issues[0].message;
		}
		let message = "Validation failed";
		if (err instanceof Error) {
			message = err.message;
		}
		return message;
	}
};
interface TextFieldConfig {
	key: string;
	label: string;
	rows: number;
	help: string;
	isRichText?: boolean;
}
interface UseTextContentFormArgs {
	initialContent: Record<string, string>;
	fetcher: FetcherWithComponents<ActionResponseData>;
	textFieldsConfig: TextFieldConfig[];
}
export function useTextContentForm({
	initialContent,
	fetcher,
	textFieldsConfig,
}: UseTextContentFormArgs): {
	autoSave: boolean;
	setAutoSave: React.Dispatch<React.SetStateAction<boolean>>;
	fields: Record<string, string>;
	errors: Record<string, string>;
	feedback: string | null;
	handleBlur: (
		e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>,
	) => void;
	handleChange: (
		e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
	) => void;
	handleSave: (e?: React.FormEvent) => void;
	handleUndo: () => void;
	isSubmitting: boolean;
} {
	const [autoSave, setAutoSave] = useState(true);
	const [fields, setFields] = useState<Record<string, string>>(initialContent);
	const [pendingFields, setPendingFields] =
		useState<Record<string, string>>(initialContent);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [feedback, setFeedback] = useState<string | null>(null);
	const isSubmittingRef = useRef(false);
	useEffect(() => {
		setFields(initialContent);
		setPendingFields(initialContent);
	}, [initialContent]);
	const labelForKey = useCallback(
		(key: string): string => {
			const field = textFieldsConfig.find((f) => f.key === key);
			return field?.label ?? key;
		},
		[textFieldsConfig],
	);
	const isRichTextField = useCallback(
		(key: string): boolean =>
			textFieldsConfig.find((f) => f.key === key)?.isRichText ?? false,
		[textFieldsConfig],
	);
	const handleBlur = useCallback(
		(e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
			if (isSubmittingRef.current) return;
			const { name, value } = e.currentTarget;
			if (isRichTextField(name)) return;
			if (autoSave) {
				const err = validateField(name, value, false);
				if (!err) {
					const data = new FormData();
					data.append("intent", "updateTextContent");
					data.append(name, value);
					isSubmittingRef.current = true;
					fetcher.submit(data, { method: "post", action: "/admin" });
					setFeedback(`Saving '${labelForKey(name)}'...`);
					setErrors((prev) => {
						const next = { ...prev };
						delete next[name];
						return next;
					});
					setFields((prev) => ({ ...prev, [name]: value }));
				} else {
					setErrors((prev) => ({ ...prev, [name]: err }));
					setFeedback(`Validation failed for '${labelForKey(name)}': ${err}`);
				}
			} else {
				setPendingFields((prev) => ({ ...prev, [name]: value }));
			}
		},
		[autoSave, fetcher, labelForKey, isRichTextField],
	);
	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
			if (autoSave) return;
			if (isRichTextField(e.currentTarget.name)) return;
			const { name, value } = e.currentTarget;
			setPendingFields((prev) => ({ ...prev, [name]: value }));
			if (errors[name]) {
				setErrors((prev) => {
					const next = { ...prev };
					delete next[name];
					return next;
				});
			}
		},
		[autoSave, errors, isRichTextField],
	);
	const handleSave = useCallback(
		(e?: React.FormEvent) => {
			e?.preventDefault();
			if (isSubmittingRef.current) return;
			let hasError = false;
			const newErrors: Record<string, string> = {};
			for (const [key, value] of Object.entries(pendingFields)) {
				try {
					validateField(key, value, isRichTextField(key));
				} catch (err: unknown) {
					let message = "Validation failed";
					if (err instanceof Error) {
						message = err.message;
					}
					newErrors[key] = message;
					hasError = true;
				}
			}
			setErrors(newErrors);
			if (hasError) {
				setFeedback("Validation failed. Please fix errors before saving.");
				return;
			}
			const data = new FormData();
			data.append("intent", "updateTextContent");
			for (const [key, value] of Object.entries(pendingFields)) {
				data.append(key, value);
			}
			isSubmittingRef.current = true;
			fetcher.submit(data, { method: "post", action: "/admin" });
			setFeedback("Saving changes...");
			setFields(pendingFields);
		},
		[fetcher, pendingFields, isRichTextField],
	);
	const handleUndo = useCallback(() => {
		setPendingFields(fields);
		setErrors({});
		setFeedback("Changes reverted.");
	}, [fields]);
	useEffect(() => {
		if (fetcher.state === "idle") {
			isSubmittingRef.current = false;
			const data = fetcher.data as ActionResponseData | undefined;
			if (data) {
				if (data.success) {
					setErrors({});
					setFeedback(data.message || "Changes saved successfully.");
				} else if (data.errors && typeof data.errors === "object") {
					setErrors(data.errors as Record<string, string>);
					setFeedback(
						data.message || "Validation failed. Please check the fields.",
					);
				} else if (data.error) {
					setFeedback(data.error);
					if (!autoSave) {
						setPendingFields(fields);
					}
				}
			} else if (fetcher.state === "idle" && !isSubmittingRef.current) {
				if (feedback?.startsWith("Saving")) {
					setFeedback(null);
				}
			}
		}
	}, [fetcher.state, fetcher.data, autoSave, fields, labelForKey, feedback]);
	return {
		autoSave,
		setAutoSave,
		fields: autoSave ? fields : pendingFields,
		errors,
		feedback,
		handleBlur,
		handleChange,
		handleSave,
		handleUndo,
		isSubmitting: fetcher.state !== "idle",
	};
}
