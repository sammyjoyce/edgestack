import {
  ArrowLeftCircleIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { NavLink, Outlet, redirect, data, type TypedResponse } from "react-router";
import { AdminErrorBoundary } from "../components/AdminErrorBoundary";
import { getSessionCookie, verify } from "~/modules/common/utils/auth";
// Import generated types
import type {
  Route, // Use generated Route type
  LoaderData,
} from "../../../.react-router/types/app/modules/admin/routes/_layout";

export async function loader({
  request,
  context,
}: Route.LoaderArgs): Promise<TypedResponse<LoaderData> | Response> { // Use generated Route.LoaderArgs
  const url = new URL(request.url);
  const isLoginRoute = url.pathname === "/admin/login";
  const isLogoutRoute = url.pathname === "/admin/logout"; // Check for logout route

  const sessionValue = getSessionCookie(request);
  const jwtSecret = context.cloudflare?.env?.JWT_SECRET;

  // Verify token function
  const isAuthenticated = async () => {
    if (!sessionValue || !jwtSecret) return false;
    try {
      return await verify(sessionValue, jwtSecret);
    } catch (e) {
      console.error("Token verification failed:", e);
      return false;
    }
  };

  const loggedIn = await isAuthenticated();

  // If not logged in and trying to access anything other than login, redirect to login
  if (!loggedIn && !isLoginRoute) {
    // Allow logout route to proceed to clear cookie even if not logged in
    if (!isLogoutRoute) {
      return redirect("/admin/login"); // Use typed path
    }
  }

  // If logged in and trying to access login, redirect to admin dashboard
  if (loggedIn && isLoginRoute) {
    return redirect("/admin"); // Use typed path
  }

  // Allow access if logged in, or if accessing login/logout page
  // Return type must match LoaderData or be a Response
  return data(null satisfies LoaderData); // Ensure null matches LoaderData type if applicable, or adjust LoaderData
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

// Ensure hrefs match the typed paths
const navigation: NavItem[] = [
  { name: "Dashboard", href: "/admin", icon: HomeIcon },
  { name: "Projects", href: "/admin/projects", icon: FolderIcon },
  { name: "Live Site", href: "/", icon: DocumentDuplicateIcon },
  { name: "Logout", href: "/admin/logout", icon: ArrowLeftCircleIcon },
];

function classNames(
  ...classes: Array<string | boolean | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

export function Component() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="flex w-72 flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 py-4 border-r border-gray-200 shadow-md">
        <div className="flex h-16 shrink-0 items-center border-b border-gray-800 mb-2 pb-2">
          <img
            src="/assets/logo_284x137-KoakP1Oi.png"
            alt="LUSH CONSTRUCTIONS"
            className="h-8 w-auto mx-auto"
          />
        </div>
        <div className="mb-2 mt-2 px-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Admin Menu
        </div>
        <hr className="border-gray-700 mb-2" />
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    {item.name === "Live Site" ? (
                      // Use standard anchor for external/non-router link
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={classNames(
                          "text-gray-400 hover:bg-gray-700 hover:text-white",
                          "group flex gap-x-3 rounded-md p-2 text-sm font-medium"
                        )}
                      >
                        <item.icon
                          aria-hidden="true"
                          className="size-5 shrink-0"
                        />
                        {item.name}
                      </a>
                    ) : (
                      // Use NavLink for internal routes with typed 'to'
                      <NavLink
                        to={item.href} // Use typed path directly
                        end={item.href === "/admin"} // Keep end prop for dashboard
                        className={({ isActive }) =>
                          classNames(
                            isActive
                              ? "bg-gray-700 text-white"
                              : "text-gray-400 hover:bg-gray-700 hover:text-white",
                            "group flex gap-x-3 rounded-md p-2 text-sm font-medium"
                          )
                        }
                      >
                        <item.icon
                          aria-hidden="true"
                          className="size-5 shrink-0"
                        />
                        {item.name}
                      </NavLink>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </aside>
      <div className="w-px bg-gray-200" />
      <main className="flex-1 px-8 py-8">
        {/* Outlet will use the error boundary provided by the ErrorBoundary function */}
        <Outlet />
      </main>
    </div>
  );
}

export function ErrorBoundary() {
  return <AdminErrorBoundary />;
}
                      }
                    >
                      <item.icon
                        aria-hidden="true"
                        className="size-5 shrink-0"
                      />
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </aside>
      <div className="w-px bg-gray-200" />
      <main className="flex-1 px-8 py-8">
        {/* Outlet will use the error boundary provided by the ErrorBoundary function */}
        <Outlet />
      </main>
    </div>
  );
}

export function ErrorBoundary() {
  return <AdminErrorBoundary />;
}
