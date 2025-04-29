import {
  ArrowLeftCircleIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { NavLink, Outlet, redirect } from "react-router";
import type { Route } from "./+types/route";
import { getSessionCookie, verify } from "~/modules/common/utils/auth";
import { data, useFetcher } from "react-router"; // Import useFetcher and data

export async function loader({ request, context }: Route.LoaderArgs) {
  const sessionValue = getSessionCookie(request);
  const jwtSecret = context.cloudflare?.env?.JWT_SECRET;
  if (!sessionValue || !jwtSecret || !(await verify(sessionValue, jwtSecret))) {
    return redirect("/admin/login");
  }
  return null;
}

// Add a placeholder action to catch unexpected submissions to the layout route
export async function action({ request }: Route.ActionArgs) {
  console.log(">>> Submission received by /admin LAYOUT action <<<");
  try {
    const formData = await request.formData();
    const dataEntries = Object.fromEntries(formData);
    console.log("Layout Action - Form Data:", dataEntries);
    const referrer = request.headers.get('referer');
    console.log("Layout Action - Referrer:", referrer);
  } catch (e) {
    console.error("Layout Action - Error reading form data:", e);
  }
  // Return a simple response to stop the error
  // Remove the placeholder action entirely
  // return data({ message: "Layout placeholder action processed submission." });
}


interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

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
        {/* Standardize admin label */}
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
                    <NavLink
                      to={item.href}
                      end={item.href === "/admin"}
                      className={({ isActive }) =>
                        classNames(
                          isActive
                            ? "bg-gray-700 text-white" // Slightly lighter active bg
                            : "text-gray-400 hover:bg-gray-700 hover:text-white",
                          "group flex gap-x-3 rounded-md p-2 text-sm font-medium" // Use text-sm and font-medium
                        )
                      }
                    >
                      <item.icon
                        aria-hidden="true"
                        className="size-5 shrink-0" // Slightly smaller icon
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
        <Outlet />
      </main>
    </div>
  );
}
