import React from "react";
import { Form } from "react-router";
import type { ProjectFormFieldsProps } from "./ProjectFormFields";
import { ProjectFormFields } from "./ProjectFormFields";

interface ProjectFormProps extends ProjectFormFieldsProps {
	formClassName?: string;
}

export function ProjectForm({
	initial = {},
	errors = {},
	isEdit = false,
	onCancel,
	formClassName = "flex flex-col gap-6",
}: ProjectFormProps) {
	return (
		<Form method="post" encType="multipart/form-data" className={formClassName}>
			<ProjectFormFields
				initial={initial}
				errors={errors}
				isEdit={isEdit}
				onCancel={onCancel}
			/>
		</Form>
	);
}
