import type { DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "~/database/schema";
import type { NewContent, NewProject, Project } from "~/database/schema";
import {
    getAllContent,
    updateContent,
} from "~/database/contentRepo";
import {
    getAllProjects,
    getFeaturedProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
} from "~/database/projectRepo";

export class CmsClient {
    constructor(private readonly db: DrizzleD1Database<typeof schema>) {}

    async getAllContent() {
        return getAllContent(this.db);
    }

    async updateContent(
        updates: Record<
            string,
            | string
            | number
            | boolean
            | Record<string, unknown>
            | Array<unknown>
            | (Partial<Omit<NewContent, "key">> & { value: unknown })
        >,
    ) {
        return updateContent(this.db, updates);
    }

    async getAllProjects(): Promise<Project[]> {
        return getAllProjects(this.db);
    }

    async getFeaturedProjects(): Promise<Project[]> {
        return getFeaturedProjects(this.db);
    }

    async getProjectById(id: number): Promise<Project | undefined> {
        return getProjectById(this.db, id);
    }

    async createProject(
        projectData: Omit<NewProject, "id" | "createdAt" | "updatedAt">,
    ): Promise<Project> {
        return createProject(this.db, projectData);
    }

    async updateProject(
        id: number,
        projectData: Partial<Omit<NewProject, "id" | "createdAt">>,
    ): Promise<Project | undefined> {
        return updateProject(this.db, id, projectData);
    }

    async deleteProject(id: number) {
        return deleteProject(this.db, id);
    }
}
