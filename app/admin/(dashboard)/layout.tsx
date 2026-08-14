import type { ReactNode } from "react";
import { Sidebar } from "@/components/admin/Sidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-full">
      <Sidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
