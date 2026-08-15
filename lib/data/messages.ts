import type { ContactMessage } from "@/types/portfolio";

// In-memory placeholder store, same pattern as lib/data/portfolio.ts —
// anchored on globalThis so it stays shared across Turbopack's separate
// dev-mode module graphs for Route Handlers vs Server Components.
// Swap for a real database/email integration once the contact flow
// requirements are defined.
declare global {
  var __messages: ContactMessage[] | undefined;
}

function store(): ContactMessage[] {
  if (!globalThis.__messages) {
    globalThis.__messages = [];
  }
  return globalThis.__messages;
}

export async function getMessages(): Promise<ContactMessage[]> {
  return [...store()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createMessage(
  input: Omit<ContactMessage, "id" | "createdAt">
): Promise<ContactMessage> {
  const message: ContactMessage = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  globalThis.__messages = [...store(), message];
  return message;
}
