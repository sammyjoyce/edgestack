import React, { useRef, useState } from "react";
import { Drawer } from "vaul";
import { ImageGallery } from "~/routes/admin/components/ImageGallery";
import { Button } from "~/routes/admin/components/ui/button";
import { Heading } from "../ui/heading";
import type { StoredImage } from "~/utils/upload.server";

interface ProjectImageSelectorProps {
	currentImage?: string;
	className?: string;
}

export function ProjectImageSelector({
	currentImage,
	className = "",
}: ProjectImageSelectorProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const handleSelectImage = (image: StoredImage) => {
		setSelectedImage(image.url);
		setIsOpen(false);
	};
	return (
		<div className={`${className} w-full`}>
			{(currentImage || selectedImage) && (
				<div className="mb-4">
					<img
						src={selectedImage || currentImage}
						alt="Selected project image"
						className="max-w-xs h-auto rounded border border-gray-200"
					/>
					<input
						type="hidden"
						name="currentImageUrl"
						value={selectedImage || currentImage || ""}
					/>
				</div>
			)}
			<div className="flex flex-col space-y-2">
				<div>
					<label
						htmlFor="image"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						{currentImage ? "Replace Image with File Upload" : "Upload Image"}
					</label>
					<input
						ref={fileInputRef}
						type="file"
						name="image"
						id="image"
						accept="image/*"
						className="block w-full text-sm text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
					/>
				</div>

				{/* Or divider */}
				<div className="relative flex items-center py-2">
					<div className="grow border-t border-gray-200" />
					<span className="shrink mx-4 text-gray-400 text-sm">OR</span>
					<div className="grow border-t border-gray-200" />
				</div>
				<div>
					<Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
						<Drawer.Trigger asChild>
							<Button invert type="button" variant="secondary" block>
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
											<ImageGallery onSelectImage={handleSelectImage} />
										</div>
									</div>
								</div>
							</Drawer.Content>
						</Drawer.Portal>
					</Drawer.Root>
				</div>
			</div>
		</div>
	);
}
