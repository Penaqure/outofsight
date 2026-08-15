"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import logo from "@/public/logo/outofsight-logo.png";

const navItems = [
  { label: "Home", href: "/admin" },
  { label: "Work", href: "/admin/works" },
  { label: "About Us", href: "/admin/about" },
  { label: "Contacts", href: "/admin/contacts" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-56 shrink-0 flex-col bg-obsidian p-4">
      <Image
        src={logo}
        alt="OUTOFSIGHT"
        className="mb-8 h-auto w-32 invert"
        priority
      />
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2 text-center text-sm transition-colors ${
                isActive
                  ? "bg-primary text-bone-white"
                  : "text-bone-white/60 hover:bg-bone-white/[.06] hover:text-bone-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={handleLogout}
        className="mt-auto rounded-md px-3 py-2 text-center text-sm text-bone-white/40 hover:bg-bone-white/[.06] hover:text-bone-white"
      >
        Log out
      </button>
    </aside>
  );
}
