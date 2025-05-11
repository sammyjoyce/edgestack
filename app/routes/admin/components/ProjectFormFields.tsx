import type React from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/fieldset";
import { Input } from "./ui/input";
import { Text } from "./ui/text";
import { ProjectImageSelector } from "./ProjectImageSelector";
import RichTextField from "./RichTextField";

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
			<div>
				<Label htmlFor="title" className="mb-1">
					Project Title <span className="text-red-600">*</span>
				</Label>
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
					<Text id="title-error" className="text-sm text-red-600">
						{errors.title}
					</Text>
				)}
			</div>
			<div>
				<Label htmlFor="description" className="mb-1">
					Description
				</Label>
				<RichTextField
					name="description"
					initialJSON={initial.description || ""}
				/>
			</div>
			<div>
				<Label htmlFor="details" className="mb-1">
					Details (e.g., Location, Duration, Budget)
				</Label>
				<RichTextField name="details" initialJSON={initial.details || ""} />
			</div>
			<div className="flex items-center gap-2">
				<Input
					type="checkbox"
					name="isFeatured"
					id="isFeatured"
					value="true"
					defaultChecked={!!initial.isFeatured}
					className="size-4 rounded border-gray-300 text-primary focus:ring-primary"
				/>
				<Label htmlFor="isFeatured">Feature on Home Page</Label>
			</div>
			<div>
				<Label className="mb-1">Project Image</Label>
				<ProjectImageSelector currentImage={initial.imageUrl || undefined} />
			</div>
			<div>
				<Label htmlFor="sortOrder" className="mb-1">
					Sort Order (lower numbers appear first)
				</Label>
				<Input
					type="number"
					name="sortOrder"
					id="sortOrder"
					min="0"
					defaultValue={initial.sortOrder ?? 0}
				/>
			</div>
			<div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
				{onCancel && (
					<Button type="button" variant="secondary" onClick={onCancel}>
						Cancel
					</Button>
				)}
				<Button type="submit">
					{isEdit ? "Save Changes" : "Create Project"}
				</Button>
			</div>
		</>
	);
};
