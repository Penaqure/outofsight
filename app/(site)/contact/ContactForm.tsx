"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex max-w-md flex-col gap-4">
      <input
        name="name"
        placeholder="Your name"
        required
        className="rounded-md border border-black/[.12] px-3 py-2 text-sm dark:border-white/[.15] dark:bg-transparent"
      />
      <input
        name="email"
        type="email"
        placeholder="Your email"
        required
        className="rounded-md border border-black/[.12] px-3 py-2 text-sm dark:border-white/[.15] dark:bg-transparent"
      />
      <textarea
        name="message"
        placeholder="Message"
        required
        rows={5}
        className="rounded-md border border-black/[.12] px-3 py-2 text-sm dark:border-white/[.15] dark:bg-transparent"
      />
      <Button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Send Message"}
      </Button>
      {status === "sent" && (
        <p className="text-sm text-green-600 dark:text-green-500">
          Message sent. We&apos;ll get back to you soon.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600 dark:text-red-500">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
