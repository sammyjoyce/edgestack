import type React from "react";
import { Link, type useFetcher } from "react-router";
import { Button } from "~/routes/admin/components/ui/button";
import { Input } from "~/routes/admin/components/ui/input";
import {
	SectionCard,
	SectionHeading,
} from "~/routes/admin/components/ui/section";
import { Strong, Text } from "~/routes/admin/components/ui/text";
import { Textarea } from "~/routes/admin/components/ui/textarea";

interface ProjectsSectionEditorProps {
	fetcher: ReturnType<typeof useFetcher>;
	initialContent: Record<string, string>;
}

export function ProjectsSectionEditor({
	fetcher,
	initialContent,
}: ProjectsSectionEditorProps): React.JSX.Element {
	const actionData = fetcher.data as
		| { success?: boolean; error?: string }
		| undefined;
	return (
		<SectionCard>
			<SectionHeading>Projects Section Intro</SectionHeading>
			<div className="grid grid-cols-1 gap-6 mt-4">
				<div>
					<label
						htmlFor="projects_intro_title"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Projects Intro Title
					</label>
					<Input
						type="text"
						name="projects_intro_title"
						id="projects_intro_title"
						className="block w-full"
						defaultValue={
							initialContent.projects_intro_title || "Recent Projects"
						}
						onBlur={(e) => {
							const formData = new FormData();
							formData.append("intent", "updateTextContent");
							formData.append("projects_intro_title", e.target.value);
							fetcher.submit(formData, { method: "post", action: "/admin" });
						}}
					/>
					{actionData?.success === false && actionData.error && (
						<Text className="ml-2 text-sm text-red-600">
							{actionData.error}
						</Text>
					)}
				</div>
				<div>
					<label
						htmlFor="projects_intro_text"
						className="block text-sm font-medium text-gray-700"
					>
						Text
					</label>
					<Textarea
						name="projects_intro_text"
						id="projects_intro_text"
						rows={3}
						defaultValue={initialContent.projects_intro_text || ""}
						onBlur={(e) => {
							const formData = new FormData();
							formData.append("intent", "updateTextContent");
							formData.append("projects_intro_text", e.target.value);
							fetcher.submit(formData, { method: "post", action: "/admin" });
						}}
					/>
					{actionData?.success === false && actionData.error && (
						<Text className="ml-2 text-sm text-red-600">
							{actionData.error}
						</Text>
					)}
				</div>
			</div>
			<div className="mt-4 text-sm text-gray-600 space-y-1">
				<Text>
					<Strong>Note:</Strong>
				</Text>
				<ul className="list-disc list-inside space-y-1">
					<li>
						To add, edit, or reorder projects, visit the Projects admin page.
					</li>
					<li>
						To feature a project on the home page, edit the project and enable
						the <span className="font-semibold text-gray-700">"Featured"</span>{" "}
						option.
					</li>
					<li>
						Project display order and details are managed in the Projects admin
						page.
					</li>
				</ul>
			</div>
			<div className="mt-6 w-fit">
				<Button
					as={Link}
					to="/admin/projects"
					color="primary"
					aria-label="Go to Projects Admin"
				>
					Go to Projects Admin
				</Button>
			</div>
		</SectionCard>
	);
}
