import { clsx } from "clsx";
import type React from "react";
import { type JSX, useState } from "react";
import { useFetcher } from "react-router";
import { Drawer } from "vaul";
import { ImageGallery } from "~/routes/admin/components/ImageGallery";
import ImageUploadZone from "~/routes/admin/components/ImageUploadZone";
import type { StoredImage } from "~/utils/upload.server";
import { Button } from "../ui/button";
import { Heading } from "../ui/heading";

interface ImageSelectorProps {
	onDrop: (files: File[]) => void;
	disabled?: boolean;
	uploading?: boolean;
	image_url?: string;
	label?: string;
	className?: string;
	fileInputRef?: React.RefObject<HTMLInputElement>;
	fieldKey: string;
	hasExistingImage?: boolean;
}

export function ImageSelector({
	onDrop,
	disabled = false,
	uploading = false,
	image_url,
	label = "Upload Image",
	className = "",
	fileInputRef,
	fieldKey,
	hasExistingImage,
}: ImageSelectorProps): JSX.Element {
	const [isOpen, setIsOpen] = useState(false);
	const fetcher = useFetcher();
	const handleSelectImage = (image: StoredImage) => {
		const formData = new FormData();
		formData.append("intent", "selectImage");
		formData.append("key", fieldKey);
		formData.append("image_url", image.url);
		fetcher.submit(formData, {
			method: "post",
			action: "/admin/upload",
			encType: "multipart/form-data",
		});
		setIsOpen(false);
	};
	return (
		<div className={clsx(className, "w-full flex flex-col items-center")}>
			<Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
				<ImageUploadZone
					onDrop={onDrop}
					disabled={disabled}
					uploading={uploading}
					label={label}
					fileInputRef={fileInputRef}
					hasExistingImage={hasExistingImage}
					browseButtonTrigger={
						<Drawer.Trigger asChild>
							<Button
								size="sm"
								type="button"
								variant="secondary"
								className="w-full"
							>
								Browse Existing Images
							</Button>
						</Drawer.Trigger>
					}
					browseDrawerPortal={
						<Drawer.Portal>
							<Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
							<Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex flex-col rounded-t-2xl bg-admin-white z-50">
								<div className="flex-1 rounded-t-2xl p-4 bg-admin-white max-h-[90vh] overflow-auto">
									<div className="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-admin-border mb-4" />
									<div className="max-w-4xl mx-auto">
										<Heading
											level={3}
											className="text-lg font-medium text-admin-foreground mb-4"
										>
											Select an Existing Image
										</Heading>
										<div className="image-gallery-container">
											<ImageGallery
												onSelectImage={handleSelectImage}
												forField={fieldKey}
											/>
										</div>

										<div className="my-6">
											<hr className="border-admin-border" />
										</div>

										<Heading
											level={4}
											className="text-md font-medium text-admin-text dark:text-admin-text mb-3"
										>
											Or Upload a New Image
										</Heading>
										<ImageUploadZone
											onDrop={(files) => {
												onDrop(files);
											}}
											disabled={disabled || uploading}
											uploading={uploading}
											className="mb-4 w-full"
										/>
									</div>
								</div>
							</Drawer.Content>
						</Drawer.Portal>
					}
				/>
			</Drawer.Root>
		</div>
	);
}
