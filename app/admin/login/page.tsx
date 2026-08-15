"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/public/logo/outofsight-logo.png";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl rounded-md bg-obsidian px-14 py-8"
      >
        <Image
          src={logo}
          alt="OUTOFSIGHT"
          className="mx-auto mb-6 h-35 w-95 invert"
          priority
        />
        <div className="flex flex-col gap-3">
          <input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full rounded-sm border border-bone-white/[.12] bg-bone-white/[.05] px-5 py-3 text-base text-bone-white placeholder:text-bone-white/40 outline-none focus:border-primary"
          />
          <input
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full rounded-sm border border-bone-white/[.12] bg-bone-white/[.05] px-5 py-3 text-base text-bone-white placeholder:text-bone-white/40 outline-none focus:border-primary"
          />
        </div>
        {error && (
          <p className="mt-3 text-sm text-red-400">{error}</p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="mt-5 w-full rounded-sm bg-primary py-3 text-base font-medium text-bone-white transition-all hover:brightness-90 disabled:opacity-60"
        >
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
