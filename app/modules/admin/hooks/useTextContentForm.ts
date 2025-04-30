import React, { useState, useCallback, useEffect, useRef } from "react";
import type { FetcherWithComponents } from "react-router";
import { validateContentInsert } from "~/database/valibot-validation";
// Import the specific action type
import type { action as adminIndexAction } from "~/modules/admin/routes/index";

// Helper function for validation (can be kept here or imported)
const validateField = (key: string, value: string): string | null => {
  try {
    // Basic check: Ensure key and value are not empty before specific validation
    if (!key || !value) {
      // Depending on requirements, empty might be valid or invalid.
      // Assuming empty is invalid for this example.
      // return "Key or value cannot be empty.";
      return null; // Or handle as needed
    }
    validateContentInsert({ key, value });
    return null;
  } catch (err: any) {
    return err.message || "Validation failed";
  }
};

// Define the structure for text fields configuration
interface TextFieldConfig {
  key: string;
  label: string;
  rows: number;
  help: string;
}

interface UseTextContentFormArgs {
  initialContent: Record<string, string>;
  fetcher: FetcherWithComponents<typeof adminIndexAction>; // Use inferred type
  textFieldsConfig: TextFieldConfig[]; // Pass the config to the hook
}

export function useTextContentForm({
  initialContent,
  fetcher,
  textFieldsConfig, // Receive the config
}: UseTextContentFormArgs) {
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
    [textFieldsConfig]
  );

  // Handler for auto-save on blur
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      if (isSubmittingRef.current) return; // Prevent blur during submission

      const { name, value } = e.currentTarget;

      if (autoSave) {
        const err = validateField(name, value);
        if (!err) {
          const data = new FormData();
          data.append("intent", "updateTextContent"); // Add intent
          data.append(name, value);
          isSubmittingRef.current = true; // Set submitting flag
          // Use typed path for action
          fetcher.submit(data, { method: "post", action: "/admin" });
          setFeedback(`Saving '${labelForKey(name)}'...`); // Use label for feedback
          setErrors((prev) => {
            const next = { ...prev };
            delete next[name];
            return next;
          });
          // Update the 'saved' fields state immediately for auto-save
          setFields((prev) => ({ ...prev, [name]: value }));
        } else {
          setErrors((prev) => ({ ...prev, [name]: err }));
          setFeedback(`Validation failed for '${labelForKey(name)}': ${err}`);
        }
      } else {
        // Only update pending state if not auto-saving
        setPendingFields((prev) => ({ ...prev, [name]: value }));
      }
    },
    [autoSave, fetcher, labelForKey]
  );

  // Handler for manual input change (only affects pending state)
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      if (autoSave) return; // Don't update pending if auto-saving

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
    [autoSave, errors]
  );

  // Manual save
  const handleSave = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (isSubmittingRef.current) return; // Prevent multiple submissions

      let hasError = false;
      const newErrors: Record<string, string> = {};
      for (const [key, value] of Object.entries(pendingFields)) {
        const err = validateField(key, value);
        if (err) {
          newErrors[key] = err;
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
      Object.entries(pendingFields).forEach(([key, value]) =>
        data.append(key, value)
      );

      isSubmittingRef.current = true; // Set submitting flag
      // Use typed path for action
      fetcher.submit(data, { method: "post", action: "/admin" });
      setFeedback("Saving changes...");
      // Update the 'saved' fields state after successful manual save intention
      setFields(pendingFields);
    },
    [fetcher, pendingFields]
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
      // Check fetcher.data structure based on AdminActionResponse
      if (fetcher.data && "success" in fetcher.data && fetcher.data.success) {
        // If auto-save was successful, fields state is already updated
        // If manual save was successful, fields state was updated in handleSave
        setErrors({}); // Clear errors on success
      } else if (fetcher.data && "error" in fetcher.data) {
        setFeedback(fetcher.data.error);
        // Optionally parse and display field-level errors if backend provides them
        // setErrors({ ... }); // Example: if backend returns { errors: { field: 'message' } }

        // If manual save failed, revert pendingFields back to the last saved state (fields)
        if (!autoSave) {
          setPendingFields(fields);
        }
      }
    }
  }, [fetcher.state, fetcher.data, autoSave, fields]);

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
