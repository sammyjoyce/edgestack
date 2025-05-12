import type React from "react";
import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { ErrorMessage } from "./ui/fieldset";
import { Input } from "./ui/input";
import ImageUploadZone from "./ImageUploadZone";
import RichTextField from "./RichTextField";
import { FieldLabel, FieldRow } from "./ui/section";
import { Drawer } from "vaul";
import { Heading } from "./ui/heading";
import { ImageGallery } from "./ImageGallery";
import type { StoredImage } from "~/utils/upload.server";
import { Checkbox } from "./ui/checkbox";

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
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(
		initial.imageUrl || null,
	);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleImageFromGallery = (image: StoredImage) => {
		setSelectedImageUrl(image.url);
		setSelectedFile(null); // Clear any selected file if choosing from gallery
		setIsDrawerOpen(false);
	};

	const handleFileDrop = (files: File[]) => {
		if (files.length > 0) {
			setSelectedFile(files[0]);
			setSelectedImageUrl(URL.createObjectURL(files[0])); // Show preview
		}
	};

	const currentPreviewUrl = selectedFile
		? selectedImageUrl // This would be the object URL for the new file
		: initial.imageUrl && !selectedImageUrl // If initial image exists and no new one is selected from gallery
			? initial.imageUrl
			: selectedImageUrl; // This would be from gallery or initial if no new file

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
				<RichTextField
					name="details"
					initialJSON={initial.details || ""}
					
				/>
			</FieldRow>
			<FieldRow>
				<span className="max-w-min">
					<div className="flex items-center gap-x-2">
						<Checkbox
							name="isFeatured"
							id="isFeatured"
							value="true"
							defaultChecked={!!initial.isFeatured}
							className="h-4 w-4"
							aria-label="Feature on Home Page"
						/>
						<label
							htmlFor="isFeatured"
							className="text-sm font-medium text-gray-700 select-none"
						>
							Feature on Home Page
						</label>
					</div>
				</span>
			</FieldRow>
			<FieldRow>
				<FieldLabel>Project Image</FieldLabel>
				<ImageUploadZone
					onDrop={handleFileDrop}
					imageUrl={currentPreviewUrl || undefined}
					label="Project Image Upload"
					fileInputRef={fileInputRef}
					inputName="image"
				/>
				{/* Hidden input for the image URL, only if not uploading a new file */}
				{!selectedFile && (
					<input
						type="hidden"
						name="currentImageUrl"
						value={selectedImageUrl || initial.imageUrl || ""}
					/>
				)}

				{/* Or divider and Drawer for existing images */}
				<div className="relative flex items-center py-3 mt-3">
					<div className="grow border-t border-gray-200" />
					<span className="shrink mx-4 text-gray-400 text-sm">OR</span>
					<div className="grow border-t border-gray-200" />
				</div>
				<div>
					<Drawer.Root open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
						<Drawer.Trigger asChild>
							<Button variant="secondary" color="secondary" type="button">
								Choose from Existing Images
							</Button>
						</Drawer.Trigger>
						<Drawer.Portal>
							<Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
							<Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex flex-col rounded-t-2xl bg-white z-50">
								<div className="flex-1 rounded-t-2xl p-4 bg-white max-h-[90vh] overflow-auto">
									<div className="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-gray-300 mb-4" />
									<div className="max-w-4xl mx-auto">
										<Heading
											level={3}
											className="text-lg font-medium text-gray-900 mb-4"
										>
											Select an Existing Image
										</Heading>
										<div className="image-gallery-container">
											<ImageGallery onSelectImage={handleImageFromGallery} />
										</div>
									</div>
								</div>
							</Drawer.Content>
						</Drawer.Portal>
					</Drawer.Root>
				</div>
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
					<Button type="button" color="neutral" onClick={onCancel}>
						Cancel
					</Button>
				)}
				<Button type="submit" color="primary">
					{isEdit ? "Save Changes" : "Create Project"}
				</Button>
			</div>
		</>
	);
};
