"use client";

import { useState } from "react";
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

// Below lg, the 300px sidebar doesn't fit alongside real content — it
// becomes a slide-in drawer opened from a compact top bar instead. At lg
// and up it's back to the always-visible static column.
export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const navLinks = (
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
            onClick={() => setOpen(false)}
            className={`px-3 py-2 text-center text-xs tracking-tight transition-colors ${
              isActive
                ? "bg-primary/50 font-semibold text-bone-white"
                : "text-bone-white/60 hover:bg-bone-white/[.06] hover:text-bone-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <div className="flex items-center justify-between bg-obsidian p-4 lg:hidden">
        <Image src={logo} alt="OUTOFSIGHT" className="h-8 w-auto invert" priority />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="text-bone-white"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[85vw] max-w-[300px] shrink-0 -translate-x-full flex-col bg-obsidian p-4 transition-transform duration-200 lg:static lg:z-auto lg:w-[300px] lg:max-w-none lg:translate-x-0 ${
          open ? "translate-x-0" : ""
        }`}
      >
        <div className="mb-8 flex items-center justify-between lg:block">
          <Image
            src={logo}
            alt="OUTOFSIGHT"
            className="h-auto w-55 invert"
            priority
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="text-bone-white lg:hidden"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {navLinks}
        <button
          onClick={handleLogout}
          className="mt-auto px-3 py-2 text-center text-xs tracking-tight text-bone-white/40 hover:bg-bone-white/[.06] hover:text-bone-white"
        >
          Log out
        </button>
      </aside>
    </>
  );
}
