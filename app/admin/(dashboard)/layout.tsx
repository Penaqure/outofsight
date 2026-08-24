import type { ReactNode } from "react";
import { Sidebar } from "@/components/admin/Sidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar />
      <main className="flex-1 bg-secondary p-6 text-obsidian sm:p-8 lg:p-[45px]">
        {children}
      </main>
    </div>
  );
}
