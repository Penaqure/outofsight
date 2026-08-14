import Link from "next/link";

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Works", href: "/admin/works" },
];

export function Sidebar() {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-black/[.08] p-4 dark:border-white/[.1]">
      <span className="mb-6 px-2 font-semibold tracking-tight">Admin</span>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-md px-2 py-1.5 text-sm text-zinc-600 hover:bg-black/[.04] hover:text-foreground dark:text-zinc-400 dark:hover:bg-white/[.06]"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <Link
        href="/admin/login"
        className="mt-auto rounded-md px-2 py-1.5 text-sm text-zinc-600 hover:bg-black/[.04] hover:text-foreground dark:text-zinc-400 dark:hover:bg-white/[.06]"
      >
        Log out
      </Link>
    </aside>
  );
}
