import React, { useEffect, useState } from "react";
import { useFetcher, useLoaderData } from "react-router";
import { Drawer } from "vaul";
import type {
	action as uploadAction,
	loader as uploadLoader,
} from "~/routes/admin/views/upload";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";
import type { StoredImage } from "~/utils/upload.server";
import { Button } from "../ui/button";

interface ImageGalleryProps {
	onSelectImage?: (image: StoredImage) => void;
	forField?: string;
}

export function ImageGallery({ onSelectImage, forField }: ImageGalleryProps) {
	const { images = [] } = useLoaderData<typeof uploadLoader>();
	const fetcher = useFetcher<typeof uploadAction>();
	const [selectedImage, setSelectedImage] = useState<StoredImage | null>(null);
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "numeric",
			minute: "2-digit",
		}).format(date);
	};
	const formatFileSize = (bytes?: number) => {
		if (bytes === undefined) return "Unknown size";
		if (bytes < 1024) return `${bytes} bytes`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	};
	const handleDelete = (image: StoredImage) => {
		if (window.confirm(`Are you sure you want to delete "${image.name}"?`)) {
			const formData = new FormData();
			formData.append("intent", "deleteImage");
			formData.append("filename", image.name);
			fetcher.submit(formData, {
				method: "post",
				action: "/admin/upload",
			});
		}
	};
	const handleSelect = (image: StoredImage) => {
		setSelectedImage(image);
		if (onSelectImage) {
			onSelectImage(image);
		}
	};
	useEffect(() => {
		if (fetcher.data?.success && fetcher.data?.action === "delete") {
			if (selectedImage && selectedImage.name === fetcher.data.filename) {
				setSelectedImage(null);
			}
		}
	}, [fetcher.data, selectedImage]);
	return (
		<div className="bg-white border border-gray-200 rounded-lg shadow-xs p-4">
			{images.length === 0 ? (
				<div className="text-center py-8">
					<Text className="text-gray-500">No images uploaded yet.</Text>
					<Text className="text-sm text-gray-400 mt-2">
						Upload images using the form on the left.
					</Text>
				</div>
			) : (
				<>
					<div className="mb-4">
						<Text className="text-sm text-gray-500">
							{images.length} image{images.length !== 1 ? "s" : ""} available
						</Text>
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
						{images.map((image: StoredImage) => (
							<div className="relative group overflow-hidden border border-gray-200 rounded-lg">
								<img
									src={image.url}
									alt={image.name}
									className="w-full h-32 object-cover"
								/>
								<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
									<div className="flex gap-2">
										<Drawer.Root>
											<Drawer.Trigger asChild>
												<Button
													variant="outline"
													size="sm"
													onClick={() => setSelectedImage(image)}
												>
													View
												</Button>
											</Drawer.Trigger>
											<Drawer.Portal>
												<Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
												<Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex flex-col rounded-t-2xl bg-white z-50">
													<div className="flex-1 rounded-t-2xl p-4 bg-white max-h-[90vh] overflow-auto">
														<div className="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-gray-300 mb-4" />
														<div className="max-w-4xl mx-auto">
															<div className="flex justify-between items-start mb-4">
																<div className="truncate max-w-[250px]">
																	<Heading
																		level={3}
																		className="text-lg font-medium text-gray-900"
																	>
																		{selectedImage?.name}
																	</Heading>
																	<Text className="text-sm text-gray-500">
																		Uploaded{" "}
																		{selectedImage &&
																			formatDate(selectedImage.uploadDate)}
																	</Text>
																	<Text className="text-sm text-gray-500">
																		{selectedImage &&
																			formatFileSize(selectedImage.size)}
																	</Text>
																</div>
																<div className="flex gap-2">
																	{forField && (
																		<fetcher.Form
																			method="post"
																			action="/admin/upload"
																		>
																			<input
																				type="hidden"
																				name="intent"
																				value="selectImage"
																			/>
																			<input
																				type="hidden"
																				name="key"
																				value={forField}
																			/>
																			<input
																				type="hidden"
																				name="imageUrl"
																				value={selectedImage?.url}
																			/>
																			<Button
																				type="submit"
																				variant="primary"
																				size="sm"
																			>
																				Use this image
																			</Button>
																		</fetcher.Form>
																	)}
																	<Button
																		variant="danger"
																		size="sm"
																		onClick={() =>
																			selectedImage &&
																			handleDelete(selectedImage)
																		}
																	>
																		Delete
																	</Button>
																</div>
															</div>
															<div className="rounded-lg overflow-hidden border border-gray-200">
																<img
																	src={selectedImage?.url}
																	alt={selectedImage?.name}
																	className="max-w-full w-full h-auto"
																/>
															</div>
															<div className="mt-4 bg-gray-50 p-3 rounded-lg">
																<Text className="text-sm font-medium text-gray-700 mb-1">
																	Image URL:
																</Text>
																<div className="flex items-center mt-1">
																	<code className="bg-gray-100 text-gray-800 px-2 py-1 text-xs rounded flex-1 overflow-x-auto">
																		{selectedImage?.url}
																	</code>
																	<Button
																		variant="secondary"
																		size="xs"
																		className="ml-2"
																		onClick={() => {
																			navigator.clipboard.writeText(
																				selectedImage?.url || "",
																			);
																		}}
																	>
																		Copy
																	</Button>
																</div>
															</div>
														</div>
													</div>
												</Drawer.Content>
											</Drawer.Portal>
										</Drawer.Root>
										<Button
											variant="danger"
											size="sm"
											onClick={() => handleDelete(image)}
										>
											Delete
										</Button>
									</div>
								</div>
								<div className="absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-75 text-white text-xs px-2 py-1 truncate">
									{image.name}
								</div>
							</div>
						))}
					</div>
				</>
			)}
		</div>
	);
}
