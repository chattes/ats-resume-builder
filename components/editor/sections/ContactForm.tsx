"use client";

import { useResume } from "@/lib/store";

const field =
  "w-full rounded-md border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none";
const label = "block text-xs font-medium text-slate-400 mb-1";

export function ContactForm() {
  const { resume, dispatch } = useResume();
  const c = resume.contact;

  function set(payload: Partial<typeof c>) {
    dispatch({ type: "SET_CONTACT", payload });
  }

  const links = c.links ?? [];

  return (
    <div className="space-y-3">
      <div>
        <label className={label} htmlFor="fullName">
          Full name
        </label>
        <input
          id="fullName"
          className={field}
          value={c.fullName}
          onChange={(e) => set({ fullName: e.target.value })}
          autoComplete="name"
        />
      </div>
      <div>
        <label className={label} htmlFor="title">
          Title
        </label>
        <input
          id="title"
          className={field}
          value={c.title ?? ""}
          onChange={(e) => set({ title: e.target.value })}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={field}
            value={c.email}
            onChange={(e) => set({ email: e.target.value })}
            autoComplete="email"
          />
        </div>
        <div>
          <label className={label} htmlFor="phone">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            className={field}
            value={c.phone}
            onChange={(e) => set({ phone: e.target.value })}
            autoComplete="tel"
          />
        </div>
      </div>
      <div>
        <label className={label} htmlFor="location">
          Location
        </label>
        <input
          id="location"
          className={field}
          value={c.location ?? ""}
          onChange={(e) => set({ location: e.target.value })}
        />
      </div>
      <div>
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Links</span>
          <button
            type="button"
            className="text-xs text-cyan-400 hover:text-cyan-300"
            onClick={() =>
              set({ links: [...links, { label: "", url: "" }] })
            }
          >
            + Add
          </button>
        </div>
        {links.map((link, i) => (
          <div key={i} className="mb-2 flex gap-2">
            <input
              aria-label={`Link ${i + 1} label`}
              placeholder="Label"
              className={field}
              value={link.label}
              onChange={(e) => {
                const next = links.map((l, j) =>
                  j === i ? { ...l, label: e.target.value } : l
                );
                set({ links: next });
              }}
            />
            <input
              aria-label={`Link ${i + 1} URL`}
              placeholder="URL"
              className={field}
              value={link.url}
              onChange={(e) => {
                const next = links.map((l, j) =>
                  j === i ? { ...l, url: e.target.value } : l
                );
                set({ links: next });
              }}
            />
            <button
              type="button"
              aria-label={`Remove link ${i + 1}`}
              className="shrink-0 text-xs text-red-400 hover:text-red-300"
              onClick={() => set({ links: links.filter((_, j) => j !== i) })}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
