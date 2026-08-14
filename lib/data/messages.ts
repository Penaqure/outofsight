import type { ContactMessage } from "@/types/portfolio";

// In-memory placeholder store. Swap for a real database/email integration
// once the contact flow requirements are defined.
let messages: ContactMessage[] = [];

export async function getMessages(): Promise<ContactMessage[]> {
  return [...messages].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createMessage(
  input: Omit<ContactMessage, "id" | "createdAt">
): Promise<ContactMessage> {
  const message: ContactMessage = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  messages = [...messages, message];
  return message;
}
