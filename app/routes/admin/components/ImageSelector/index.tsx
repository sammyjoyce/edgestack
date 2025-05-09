import React, { type JSX, useState, useRef } from "react"; // Import React and useRef
import { useFetcher } from "react-router";
import { Drawer } from "vaul";
import { ImageGallery } from "~/routes/admin/components/ImageGallery";
import ImageUploadZone from "~/routes/admin/components/ImageUploadZone";
import { Button } from "~/routes/admin/components/ui/Button";
import type { StoredImage } from "~/utils/upload.server";

interface ImageSelectorProps {
	onDrop: (files: File[]) => void;
	disabled?: boolean;
	uploading?: boolean;
	imageUrl?: string;
	label?: string;
	className?: string;
	fileInputRef?: React.RefObject<HTMLInputElement>;
	fieldKey: string;
}

export function ImageSelector({
	onDrop,
	disabled = false,
	uploading = false,
	imageUrl,
	label = "Upload Image",
	className = "",
	fileInputRef, // This ref is passed from parent, no need to create one here if parent manages it
	fieldKey,
}: ImageSelectorProps): JSX.Element { // Changed to JSX.Element
	const [isOpen, setIsOpen] = useState(false);
	const fetcher = useFetcher();

	// Handle selection of an existing image
	const handleSelectImage = (image: StoredImage) => {
		const formData = new FormData();
		formData.append("intent", "selectImage");
		formData.append("key", fieldKey);
		formData.append("imageUrl", image.url);

		fetcher.submit(formData, {
			method: "post",
			action: "/admin/upload",
			encType: "multipart/form-data",
		});

		setIsOpen(false);
	};

	return (
		<div className={`${className} w-full flex flex-col items-center`}>
			<ImageUploadZone
				onDrop={onDrop}
				disabled={disabled}
				uploading={uploading}
				imageUrl={imageUrl}
				label={label}
				fileInputRef={fileInputRef}
			/>

			<div className="flex justify-center mt-2 w-full">
				<Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
					<Drawer.Trigger asChild>
						<Button invert type="button" className="w-full">
							Browse Existing Images
						</Button>
					</Drawer.Trigger>
					<Drawer.Portal>
						<Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
						<Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex flex-col rounded-t-2xl bg-white z-50">
							<div className="flex-1 rounded-t-2xl p-4 bg-white max-h-[90vh] overflow-auto">
								<div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-4" />

								<div className="max-w-4xl mx-auto">
									<h3 className="text-lg font-medium text-gray-900 mb-4">
										Select an Existing Image
									</h3>

									<div className="image-gallery-container">
										<ImageGallery
											onSelectImage={handleSelectImage}
											forField={fieldKey}
										/>
									</div>
								</div>
							</div>
						</Drawer.Content>
					</Drawer.Portal>
				</Drawer.Root>
			</div>
		</div>
	);
}
