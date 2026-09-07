"use client";

import { useState } from "react";
import type { ContactsContent } from "@/types/content";
import { SaveBar, useSave } from "@/components/admin/SaveBar";

const countryCodes = [
  { code: "+1", label: "+1 (US/Canada)" },
  { code: "+44", label: "+44 (UK)" },
  { code: "+91", label: "+91 (India)" },
  { code: "+971", label: "+971 (UAE)" },
  { code: "+966", label: "+966 (Saudi Arabia)" },
  { code: "+974", label: "+974 (Qatar)" },
  { code: "+65", label: "+65 (Singapore)" },
  { code: "+61", label: "+61 (Australia)" },
  { code: "+49", label: "+49 (Germany)" },
  { code: "+33", label: "+33 (France)" },
  { code: "+81", label: "+81 (Japan)" },
  { code: "+86", label: "+86 (China)" },
];

const fieldClass =
  "mt-2 w-full bg-obsidian/10 px-4 py-3.5 text-sm text-obsidian placeholder:text-obsidian/40 outline-none focus:ring-1 focus:ring-primary";

export function ContactsContentForm({
  initialContent,
}: {
  initialContent: ContactsContent;
}) {
  const [bodyText, setBodyText] = useState(initialContent.bodyText);
  const [email, setEmail] = useState(initialContent.email);
  const [countryCode, setCountryCode] = useState(initialContent.countryCode);
  const [phoneNumber, setPhoneNumber] = useState(initialContent.phoneNumber);
  const [location, setLocation] = useState(initialContent.location);

  const [dirty, setDirty] = useState(false);
  const { saving, status, save, clearStatus } = useSave("/api/content/contacts");

  function update<T>(setter: (value: T) => void) {
    return (value: T) => {
      setter(value);
      setDirty(true);
      clearStatus();
    };
  }

  async function handleSave() {
    const ok = await save({
      bodyText,
      email,
      countryCode,
      phoneNumber,
      location,
    });
    if (ok) setDirty(false);
  }

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <p className="text-base text-obsidian">Body Text</p>
          <input
            value={bodyText}
            onChange={(e) => update(setBodyText)(e.target.value)}
            placeholder="Type Here"
            className={fieldClass}
          />
        </div>
        <div>
          <p className="text-base text-obsidian">Email</p>
          <input
            type="email"
            value={email}
            onChange={(e) => update(setEmail)(e.target.value)}
            placeholder="email@example.com"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <p className="text-base text-obsidian">Country Code</p>
          <select
            value={countryCode}
            onChange={(e) => update(setCountryCode)(e.target.value)}
            className={`${fieldClass} ${countryCode ? "" : "text-obsidian/40"}`}
          >
            <option value="" disabled>
              Select Country
            </option>
            {countryCodes.map((c) => (
              <option key={c.code} value={c.code} className="text-obsidian">
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p className="text-base text-obsidian">Phone Number</p>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => update(setPhoneNumber)(e.target.value)}
            placeholder="Enter Phone Number"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <p className="text-base text-obsidian">Location</p>
          <input
            value={location}
            onChange={(e) => update(setLocation)(e.target.value)}
            placeholder="Enter Location"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="mt-8">
        <SaveBar
          status={status}
          saving={saving}
          disabled={!dirty || saving}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
