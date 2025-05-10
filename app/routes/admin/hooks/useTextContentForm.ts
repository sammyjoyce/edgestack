import type React from "react"; // Import React
import { useCallback, useEffect, useRef, useState } from "react";
import type { FetcherWithComponents } from "react-router";
import { validateContentInsert } from "../../../../database/valibot-validation.js";

// Define the expected shape of action response data explicitly
// Ensure ActionResponseData matches the actual structure from the server action,
// especially the `errors` field for validation.
type ActionResponseData = {
	success?: boolean;
	error?: string; // General error message
	message?: string;
	errors?: Record<string, string>; // Field-specific validation errors
};

const validateField = (
	key: string,
	value: string,
	isRichText: boolean,
): string | null => {
	// Skip validation for rich text fields for now
	if (isRichText) return null;

	try {
		if (!key) return "Field key is missing."; // Add check for key
		// Value can be empty, schema should define if it's optional or not.
		// Provide all required fields for validateContentInsert.
		// These might need to come from TextFieldConfig or be contextually determined.
		validateContentInsert({ key, value, page: "home", section: "dynamic", type: "text" });
		return null;
	} catch (err: unknown) {
		// ... (error handling for ValiError can be more specific here if needed)
		if (err instanceof ValiError && err.issues.length > 0) {
			return err.issues[0].message; // Return the first validation issue message
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
	isRichText?: boolean; // Add flag for rich text fields
}

interface UseTextContentFormArgs {
	initialContent: Record<string, string>;
	fetcher: FetcherWithComponents<ActionResponseData>; // Use explicit response type
	textFieldsConfig: TextFieldConfig[]; // Pass the config to the hook
}

export function useTextContentForm({
	initialContent,
	fetcher,
	textFieldsConfig, // Receive the config
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
	const isSubmittingRef = useRef(false); // Ref to track submission state

	// Update local state if initialContent changes (e.g., after successful save)
	useEffect(() => {
		setFields(initialContent);
		setPendingFields(initialContent);
	}, [initialContent]);

	// Helper to get label for feedback messages
	const labelForKey = useCallback(
		(key: string): string => {
			const field = textFieldsConfig.find((f) => f.key === key);
			return field?.label ?? key; // Fallback to key if label not found
		},
		[textFieldsConfig],
	);

	// Helper to check if a field is rich text
	const isRichTextField = useCallback(
		(key: string): boolean =>
			textFieldsConfig.find((f) => f.key === key)?.isRichText ?? false,
		[textFieldsConfig],
	);

	// Handler for auto-save on blur
	const handleBlur = useCallback(
		(e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
			if (isSubmittingRef.current) return; // Prevent blur during submission

			const { name, value } = e.currentTarget;

			// Skip blur handling for rich text fields as they update via hidden input
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

	// Handler for manual input change (only affects pending state)
	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
			if (autoSave) return; // Don't update pending if auto-saving

			// Skip change handling for rich text fields
			if (isRichTextField(e.currentTarget.name)) return;

			const { name, value } = e.currentTarget;
			setPendingFields((prev) => ({ ...prev, [name]: value }));
			// Optionally clear error on change
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

	// Manual save
	const handleSave = useCallback(
		(e?: React.FormEvent) => {
			e?.preventDefault();
			if (isSubmittingRef.current) return; // Prevent multiple submissions

			let hasError = false;
			const newErrors: Record<string, string> = {};
			for (const [key, value] of Object.entries(pendingFields)) {
				try {
					// Pass isRichText flag to validation
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
			data.append("intent", "updateTextContent"); // Add intent
			for (const [key, value] of Object.entries(pendingFields)) {
				data.append(key, value);
			}

			isSubmittingRef.current = true; // Set submitting flag
			// Use typed path for action
			fetcher.submit(data, { method: "post", action: "/admin" }); // Explicitly use /admin
			setFeedback("Saving changes...");
			// Update the 'saved' fields state after successful manual save intention
			setFields(pendingFields);
		},
		[fetcher, pendingFields, isRichTextField],
	);

	// Manual undo
	const handleUndo = useCallback(() => {
		setPendingFields(fields); // Revert pending to last saved state
		setErrors({}); // Clear errors
		setFeedback("Changes reverted.");
	}, [fields]);

	// Listen for fetcher feedback
	useEffect(() => {
		if (fetcher.state === "idle") {
			isSubmittingRef.current = false; // Reset submitting flag when idle

			// Safely handle fetcher data with proper type narrowing
			const data = fetcher.data as ActionResponseData | undefined;

			if (data) {
				if (data.success) {
					setErrors({});
					setFeedback(data.message || "Changes saved successfully."); // Provide feedback on success
				} else if (data.errors && typeof data.errors === 'object') {
					setErrors(data.errors as Record<string, string>);
					setFeedback(data.message || "Validation failed. Please check the fields."); // Use server message if available
					// If not autoSave, pendingFields remain for correction.
				} else if (data.error) {
					setFeedback(data.error);
					if (!autoSave) {
						setPendingFields(fields);
					}
				}
			} else if (fetcher.state === "idle" && !isSubmittingRef.current) {
				// Handle cases where fetcher becomes idle without new data (e.g. after initial load or non-data-changing submission)
				// Potentially clear feedback or set a generic "Ready" status if appropriate.
				// For now, let's ensure feedback isn't stuck on "Saving..."
				if (feedback?.startsWith("Saving")) {
					setFeedback(null);
				}
			}
		}
	}, [fetcher.state, fetcher.data, autoSave, fields, labelForKey, feedback]); // Added feedback to dependency array

	return {
		autoSave,
		setAutoSave,
		fields: autoSave ? fields : pendingFields, // Return correct fields based on mode
		errors,
		feedback,
		handleBlur,
		handleChange,
		handleSave,
		handleUndo,
		isSubmitting: fetcher.state !== "idle", // Expose submitting state
	};
}
