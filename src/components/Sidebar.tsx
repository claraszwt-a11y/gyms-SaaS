"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Alunos",
    href: "/alunos",
  },
  {
    name: "Financeiro",
    href: "/financeiro",
  },
  {
    name: "Check-ins",
    href: "/checkins",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden min-h-screen w-72 border-r border-white/10 bg-[#090909] p-6 md:block">
        <div>
          <h1 className="text-2xl font-black text-white">
            GYMS
          </h1>

          <p className="mt-1 text-xs text-zinc-500">
            Premium SaaS
          </p>
        </div>

        <nav className="mt-10 space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                pathname === link.href
                  ? "bg-white text-black"
                  : "text-zinc-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/95 p-3 md:hidden">
        <nav className="flex items-center justify-around">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-xl px-4 py-2 text-sm transition ${
                pathname === link.href
                  ? "bg-white text-black"
                  : "text-zinc-400"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}