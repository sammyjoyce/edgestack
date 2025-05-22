import { describe, expect, test } from "bun:test";
import type { CmsClient } from "~/services/cms.client";
import { fetchProjectsList } from "./services";

describe("fetchProjectsList", () => {
	test("returns content and projects from the CMS", async () => {
		const mockContent = { heading: "hello" };
		const mockProjects: Array<{ id: number }> = [{ id: 1 }];
		const cms: Partial<CmsClient> = {
			getAllContent: async () => mockContent,
			getProjectsPage: async () => mockProjects,
		};
		const result = await fetchProjectsList(cms as CmsClient);
		expect(result).toEqual({ content: mockContent, projects: mockProjects });
	});

	test("throws when cms methods fail", async () => {
		const cms: Partial<CmsClient> = {
			getAllContent: async () => {
				throw new Error("oops");
			},
			getProjectsPage: async () => [],
		};
		await expect(fetchProjectsList(cms as CmsClient)).rejects.toThrow(
			"fetchProjectsList failed: oops",
		);
	});
});
