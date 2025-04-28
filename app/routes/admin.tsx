import {
  HomeIcon,
  FolderIcon,
  DocumentDuplicateIcon,
  ArrowLeftCircleIcon,
} from '@heroicons/react/24/outline';
import { Outlet } from "react-router";
import { NavLink } from "react-router-dom";
import { getSessionCookie, verify } from "../utils/auth";
import { redirect } from "react-router";

export async function loader({ request, context }: { request: Request, context: any }) {
  const sessionValue = getSessionCookie(request);
  if (!sessionValue || !(context.cloudflare.env as any).JWT_SECRET || !(await verify(sessionValue, (context.cloudflare.env as any).JWT_SECRET))) {
    return redirect("/admin/login");
  }
  return null;
}


const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Projects', href: '/admin/projects', icon: FolderIcon },
  { name: 'Live Site', href: '/', icon: DocumentDuplicateIcon },
  { name: 'Logout', href: '/admin/logout', icon: ArrowLeftCircleIcon },
];

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export default function AdminLayout() {
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
        <div className="mb-2 mt-2 px-1 text-xs font-semibold uppercase tracking-wider text-gray-500">Admin</div>
        <hr className="border-gray-800 mb-2" />
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
                            isActive ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                            'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold'
                          )
                        }
                      >
                        <item.icon aria-hidden="true" className="size-6 shrink-0" />
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
        <Outlet />
      </main>
    </div>
  );
}
