# Improvement Tasks

Here's an actionable, enumerated task list derived from the analysis of the repository to implement recommended improvements:

## ✅ **Code Organization & Modularity**
- [x] **1.** Move all business logic and database interactions to dedicated service modules in a top-level `services/` or `lib/` directory.
- [x] **2.** Consolidate common utility functions from `app/routes/common/utils/` to a top-level `utils/` directory.
- [x] **3.** Ensure consistent route and component file structure, aligning all routes with React Router v7 conventions.
- [x] **4.** Abstract repetitive form logic (e.g., `ProjectForm`) to reusable components within the admin section.
- [x] **5.** Standardize naming conventions for keys and variables (e.g., consistently use `_url` suffix for image URLs).
- [x] **6.** Split `app/routes/common/db/index.ts` into separate modules per domain (e.g., `database/contentRepo.ts`, `database/projectRepo.ts`).

## ✅ **CMS Integration & Flexibility**
- [x] **7.** Abstract the CMS/data layer by creating a `CmsProvider` or `cms.client.ts` with methods for all data interactions..
- [x] **9.** Decouple content schema definitions from rendering logic, moving schemas/configurations into centralized modules.

## ✅ **Developer Experience & Onboarding**
- [x] **11.** Enhance README documentation with explicit setup instructions (e.g., installing Bun, Wrangler, Cloudflare credentials setup).
- [ ] **13.** Integrate formatting and linting tools (Biome) with pre-commit hooks using Husky or similar tools.
- [ ] **14.** Clearly document testing instructions and include additional example unit tests for loaders and utilities.
- [ ] **15.** Add inline code documentation (JSDoc-style) to clarify roles of complex components (e.g., Durable Objects, loaders).
- [ ] **16.** Enforce a secure default admin password setup with prompts or warnings in the admin interface or console logs.

## ✅ **Scalability & Maintainability**
- [ ] **17.** Mitigate Durable Object bottlenecks by partitioning workload (e.g., separate Durable Objects for read/write workloads).
- [ ] **18.** Clearly document potential scalability concerns with the current architecture (Durable Objects and D1 limitations).
- [ ] **19.** Keep database interaction code database-agnostic for ease of future migration from Cloudflare D1 to alternative DBs (e.g., PostgreSQL).
- [ ] **20.** Add pagination and filtering examples for fetching large datasets, demonstrating Drizzle's capabilities.
- [ ] **21.** Expand performance instrumentation (e.g., query timing) to consistently monitor and optimize database performance.
- [ ] **22.** Implement structured logging and consistent error handling practices across loaders, actions, and Durable Objects.
- [ ] **23.** Provide sample GitHub Actions CI workflow (lint, tests, type checks) to enhance maintainability.
- [ ] **24.** Regularly enforce coding guidelines from TigerStyle via automated lint rules or periodic code audits.

## ✅ **Extensibility for Common Client Needs**
- [ ] **25.** Prepare content schema for potential multi-language (i18n) support by including optional locale identifiers or prefixes.
- [ ] **26.** Provide an example or basic documentation demonstrating how to add route-based i18n support.
- [ ] **27.** Expand existing SEO metadata management by systematically including Open Graph and Twitter Card tags.
- [ ] **28.** Include example or documentation for generating a dynamic sitemap (`/sitemap.xml`).
- [ ] **29.** Document optional caching strategies (e.g., Cloudflare edge caching for public pages).
- [ ] **30.** Offer an optional extension example or documentation for adding multi-user authentication and role-based access control.
- [ ] **31.** Clearly outline how external OAuth integration could replace or complement the existing admin auth implementation.
- [ ] **32.** Ensure bundle-splitting explicitly separates heavy admin UI scripts from public-facing site scripts.
- [ ] **33.** Include documentation or examples on image optimization (responsive images, modern formats) leveraging Cloudflare services.
- [ ] **34.** Demonstrate or document use of caching via Cloudflare Cache API for dynamic content or API responses.
- [ ] **35.** Abstract and generalize admin UI sections/components (e.g., forms, list views) to simplify adding new content types (e.g., blog posts, testimonials).
- [ ] **36.** Provide a documented pattern or a small CLI/tool for quickly scaffolding new resource types (CRUD functionality, UI templates).

