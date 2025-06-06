import React, { useEffect } from "react";
import { useActionData, useNavigation, useSearchParams } from "react-router";
import { redirect } from "react-router";
import { Toaster, toast } from "sonner";
import { ValiError } from "valibot";
import { assert } from "~/utils/assert";
import { checkSession } from "~/utils/auth";
import { validateContentInsert } from "../../../../database/valibot-validation.js";
import AdminDashboard from "../components/AdminDashboard";
import { ButtonLED } from "../components/ui/button";
import { fetchAdminContent } from "../services";
import type { Route } from "./+types";

const DEBUG = process.env.NODE_ENV !== "production";

export async function loader({ request, context }: Route.LoaderArgs) {
	const env = context.cloudflare?.env;
	if (!env || !(await checkSession(request, env))) {
		throw redirect("/admin/login");
	}

	try {
		const content = await fetchAdminContent(context.cms);
		if (DEBUG)
			console.log("[ADMIN LOADER] Loaded content keys:", Object.keys(content));
		return { content };
	} catch (error) {
		console.error("Failed to load content:", error);
		throw redirect("/admin/login?error=session_expired");
	}
}

async function handleUpdateTextContent(
	formData: FormData,
	context: Route.ActionArgs["context"],
) {
	const updates: Record<string, string> = {};
	for (const [key, value] of formData.entries()) {
		if (key !== "intent" && typeof value === "string") {
			updates[key] = value;
		}
	}

	if (Object.keys(updates).length === 0) {
		return { success: false, error: "No updates provided" };
	}

	const validationErrors: Record<string, string> = {};
	for (const [key, value] of Object.entries(updates)) {
		try {
			validateContentInsert({
				key,
				value,
				page: "home",
				section: "unknown",
				type: "text",
			});
		} catch (err) {
			if (err instanceof ValiError) {
				validationErrors[key] = err.issues[0].message;
			} else {
				validationErrors[key] = "Validation failed";
			}
		}
	}

	if (Object.keys(validationErrors).length > 0) {
		return { success: false, errors: validationErrors };
	}

	await context.cms.updateContent(updates);
	return { success: true, action: "updateTextContent" };
}

async function handleReorderSections(
	formData: FormData,
	context: Route.ActionArgs["context"],
) {
	const order = formData.get("home_sections_order")?.toString();
	if (!order) return { success: false, error: "Missing sections order" };

	await context.cms.updateContent({ home_sections_order: order });
	return { success: true, action: "reorderSections" };
}

export async function action({ request, context }: Route.ActionArgs) {
	const env = context.cloudflare?.env;
	if (!env || !(await checkSession(request, env))) {
		return redirect("/admin/login");
	}

	if (request.method !== "POST") {
		return { success: false, error: "Method not allowed" };
	}

	try {
		const formData = await request.formData();
		const intent = formData.get("intent");

		switch (intent) {
			case "updateTextContent":
				return await handleUpdateTextContent(formData, context);
			case "reorderSections":
				return await handleReorderSections(formData, context);
			default:
				return { success: false, error: "Unknown intent" };
		}
	} catch (error) {
		console.error("Action error:", error);
		return { success: false, error: "An unexpected error occurred" };
	}
}

export default function AdminIndexPage({ loaderData }: Route.ComponentProps) {
	const actionData = useActionData<typeof action>();
	const navigation = useNavigation();
	const [searchParams, setSearchParams] = useSearchParams();
	const isLoading = navigation.state === "submitting";

	useEffect(() => {
		if (actionData?.success) {
			toast.success(
				<span className="flex items-center gap-2 font-mono text-admin-success text-base">
					{actionData.action === "updateTextContent"
						? "Content updated successfully!"
						: "Sections reordered successfully!"}
				</span>,
				{ icon: <ButtonLED isActive={true} /> },
			);
			setSearchParams({}, { replace: true });
		} else if (actionData?.error) {
			toast.error(actionData.error);
		}
	}, [actionData, setSearchParams]);

	return (
		<>
			<Toaster position="bottom-right" />
			<main id="admin-dashboard-main" aria-label="Admin Dashboard">
				<AdminDashboard
					initialContent={loaderData.content}
					isLoading={isLoading}
					actionData={actionData}
				/>
			</main>
		</>
	);
}
