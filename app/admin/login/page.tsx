import Image from "next/image";
import logo from "@/public/logo/outofsight-logo.png";

// Placeholder login screen — no auth backend wired up yet.
// Once an auth strategy is chosen, wire this form up to it and use
// proxy.ts to gate access to /admin/(dashboard) routes.
export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-6">
      <form className="w-full max-w-xl rounded-md bg-obsidian px-14 py-8">
        <Image
          src={logo}
          alt="OUTOFSIGHT"
          className="mx-auto mb-6 h-auto w-44 invert"
          priority
        />
        <div className="flex flex-col gap-3">
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full rounded-sm border border-bone-white/[.12] bg-bone-white/[.05] px-5 py-3 text-base text-bone-white placeholder:text-bone-white/40 outline-none focus:border-primary"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full rounded-sm border border-bone-white/[.12] bg-bone-white/[.05] px-5 py-3 text-base text-bone-white placeholder:text-bone-white/40 outline-none focus:border-primary"
          />
        </div>
        <button
          type="submit"
          className="mt-5 w-full rounded-sm bg-primary py-3 text-base font-medium text-bone-white transition-all hover:brightness-90"
        >
          Login
        </button>
      </form>
    </div>
  );
}
