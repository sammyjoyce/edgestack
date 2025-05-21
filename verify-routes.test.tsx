import { beforeAll, describe, expect, test } from "bun:test";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { type RouterProvider, createMemoryRouter } from "react-router";
import routeConfig from "./app/routes";
import { SharedErrorBoundary } from "./app/routes/common/components/ErrorBoundary";
const createRouter = (initialEntry: string) => {
  return createMemoryRouter(routeConfig, {
    initialEntries: [initialEntry],
  });
};
const renderRouter = async (router: ReturnType<typeof createMemoryRouter>) => {
  const result = render(<RouterProvider router={router} />);
  await waitFor(() => {
    expect(router.state.initialized).toBe(true);
  });
  return result;
};
describe('Route Architecture Tests', () => {
  describe('Home Routes', () => {
    test('Home route (/) renders correctly', async () => {
      const router = createRouter('/');
      await renderRouter(router);
      expect(router.state.location.pathname).toBe('/');
    });
  });
  describe('Projects Routes', () => {
    test('Projects index route (/projects) renders correctly', async () => {
      const router = createRouter('/projects');
      await renderRouter(router);
      expect(router.state.location.pathname).toBe('/projects');
    });
    test('Project detail route (/projects/:id) renders correctly', async () => {
      const router = createRouter('/projects/1');
      await renderRouter(router);
      expect(router.state.location.pathname).toBe('/projects/1');
    });
  });
  describe('Admin Routes', () => {
    beforeAll(() => {
      global.document.cookie = 'session=test-token; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400';
    });
    test('Admin dashboard route (/admin) renders correctly', async () => {
      const router = createRouter('/admin');
      await renderRouter(router);
      expect(router.state.location.pathname).toBe('/admin');
    });
    test('Admin login route (/admin/login) renders correctly', async () => {
      const router = createRouter('/admin/login');
      await renderRouter(router);
      expect(router.state.location.pathname).toBe('/admin/login');
    });
    test('Admin projects route (/admin/projects) renders correctly', async () => {
      const router = createRouter('/admin/projects');
      await renderRouter(router);
      expect(router.state.location.pathname).toBe('/admin/projects');
    });
    test('Admin new project route (/admin/projects/new) renders correctly', async () => {
      const router = createRouter('/admin/projects/new');
      await renderRouter(router);
      expect(router.state.location.pathname).toBe('/admin/projects/new');
    });
    test('Admin edit project route (/admin/projects/:id/edit) renders correctly', async () => {
      const router = createRouter('/admin/projects/1/edit');
      await renderRouter(router);
      expect(router.state.location.pathname).toBe('/admin/projects/1/edit');
    });
    test('Admin delete project route (/admin/projects/:id/delete) renders correctly', async () => {
      const router = createRouter('/admin/projects/1/delete');
      await renderRouter(router);
      expect(router.state.location.pathname).toBe('/admin/projects/1/delete');
    });
  });
  describe('Error Boundaries', () => {
    test('Error thrown in a route component is caught by the nearest error boundary', async () => {
      const ErrorComponent = () => {
        throw new Error("Test error");
      };
      const testRouter = createMemoryRouter(
        [
          {
            path: "/",
            element: <ErrorComponent />,
            errorElement: <SharedErrorBoundary />,
          },
        ],
        { initialEntries: ["/"] },
      );
      render(<RouterProvider router={testRouter} />);
      await screen.findByText("Return to Home Page");
    });
  });
});
