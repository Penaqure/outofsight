// Placeholder login screen — no auth backend wired up yet.
// Once an auth strategy is chosen, wire this form up to it and use
// proxy.ts to gate access to /admin/(dashboard) routes.
export default function AdminLoginPage() {
  return (
    <div className="flex min-h-full items-center justify-center">
      <form className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-black/[.08] p-6 dark:border-white/[.1]">
        <h1 className="text-xl font-semibold tracking-tight">Admin Login</h1>
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="rounded-md border border-black/[.12] px-3 py-2 text-sm dark:border-white/[.15] dark:bg-transparent"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="rounded-md border border-black/[.12] px-3 py-2 text-sm dark:border-white/[.15] dark:bg-transparent"
        />
        <button
          type="submit"
          className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
