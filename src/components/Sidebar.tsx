"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Wallet,
  ClipboardCheck,
} from "lucide-react";

const links = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Alunos",
    href: "/alunos",
    icon: Users,
  },
  {
    name: "Financeiro",
    href: "/financeiro",
    icon: Wallet,
  },
  {
    name: "Check-ins",
    href: "/checkins",
    icon: ClipboardCheck,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden min-h-screen w-72 border-r border-white/10 bg-[#090909] p-6 md:block">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            GYMS
          </h1>

          <p className="mt-1 text-xs uppercase tracking-widest text-zinc-500">
            Premium SaaS
          </p>
        </div>

        <nav className="mt-10 space-y-3">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                  pathname === link.href
                    ? "border border-lime-400/30 bg-lime-400/10 text-lime-400 shadow-lg shadow-lime-500/10"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon
                  size={20}
                  className={`transition ${
                    pathname === link.href
                      ? "text-lime-400"
                      : "text-zinc-500 group-hover:text-white"
                  }`}
                />

                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-10">
          <div className="rounded-3xl border border-lime-400/20 bg-lime-400/5 p-4">
            <p className="text-xs uppercase tracking-wider text-lime-400">
              GYMS Premium
            </p>

            <p className="mt-2 text-sm text-zinc-400">
              Gestão inteligente para academias.
            </p>
          </div>
        </div>
      </aside>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/95 p-3 md:hidden">
        <nav className="flex items-center justify-around">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition ${
                  pathname === link.href
                    ? "text-lime-400"
                    : "text-zinc-500"
                }`}
              >
                <Icon size={20} />
                <span className="text-xs">{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}