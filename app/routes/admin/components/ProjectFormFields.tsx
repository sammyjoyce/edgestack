import type React from "react";
import { Button } from "./ui/button";
import { ErrorMessage } from "./ui/fieldset";
import { Input } from "./ui/input";
import { Text } from "./ui/text";
import { ProjectImageSelector } from "./ProjectImageSelector";
import RichTextField from "./RichTextField";
import { FieldLabel, FieldRow } from "./ui/section";

export interface ProjectFormFieldsProps {
  initial?: {
    title?: string;
    description?: string;
    details?: string;
    imageUrl?: string;
    isFeatured?: boolean;
    sortOrder?: number;
  };
  errors?: Record<string, string>;
  isEdit?: boolean;
  onCancel?: () => void;
}

export const ProjectFormFields: React.FC<ProjectFormFieldsProps> = ({
  initial = {},
  errors = {},
  isEdit = false,
  onCancel,
}) => {
  return (
    <>
      <FieldRow>
        <FieldLabel htmlFor="title">
          Project Title <span className="text-red-600">*</span>
        </FieldLabel>
        <Input
          type="text"
          name="title"
          id="title"
          required
          defaultValue={initial.title || ""}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "title-error" : undefined}
        />
        {errors.title && (
          <ErrorMessage id="title-error">{errors.title}</ErrorMessage>
        )}
      </FieldRow>
      <FieldRow>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <RichTextField
          name="description"
          initialJSON={initial.description || ""}
        />
      </FieldRow>
      <FieldRow>
        <FieldLabel htmlFor="details">
          Details (e.g., Location, Duration, Budget)
        </FieldLabel>
        <RichTextField name="details" initialJSON={initial.details || ""} />
      </FieldRow>
      <FieldRow>
        <div className="flex items-center gap-2">
          <Input
            type="checkbox"
            name="isFeatured"
            id="isFeatured"
            value="true"
            defaultChecked={!!initial.isFeatured}
            className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <FieldLabel htmlFor="isFeatured" className="!mb-0">
            Feature on Home Page
          </FieldLabel>
        </div>
      </FieldRow>
      <FieldRow>
        <FieldLabel>Project Image</FieldLabel>
        <ProjectImageSelector currentImage={initial.imageUrl || undefined} />
      </FieldRow>
      <FieldRow>
        <FieldLabel htmlFor="sortOrder">
          Sort Order (lower numbers appear first)
        </FieldLabel>
        <Input
          type="number"
          name="sortOrder"
          id="sortOrder"
          min="0"
          defaultValue={initial.sortOrder ?? 0}
        />
      </FieldRow>
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary">
          {isEdit ? "Save Changes" : "Create Project"}
        </Button>
      </div>
    </>
  );
};
