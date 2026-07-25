import { describe, it, expect, afterEach, vi } from "vitest";
import { emptyResume } from "@/lib/defaults";
import { getPersona } from "@/lib/personas";
import { sampleResume } from "./fixtures/sample-resume";
import {
  resumeReducer,
  loadResume,
  STORAGE_KEY,
  type ResumeAction,
} from "@/lib/store";

describe("resumeReducer", () => {
  it("SET_CONTACT merges contact fields", () => {
    const state = emptyResume();
    const next = resumeReducer(state, {
      type: "SET_CONTACT",
      payload: { fullName: "Ada Lovelace", email: "ada@example.com" },
    });
    expect(next.contact.fullName).toBe("Ada Lovelace");
    expect(next.contact.email).toBe("ada@example.com");
    expect(next.contact.phone).toBe("");
  });

  it("SET_SUMMARY / SET_SKILLS / SET_META update fields", () => {
    let state = emptyResume();
    state = resumeReducer(state, { type: "SET_SUMMARY", payload: "Hello" });
    state = resumeReducer(state, {
      type: "SET_SKILLS",
      payload: ["TypeScript"],
    });
    state = resumeReducer(state, {
      type: "SET_META",
      payload: { template: "classic", pageSize: "A4" },
    });
    expect(state.summary).toBe("Hello");
    expect(state.skills).toEqual(["TypeScript"]);
    expect(state.meta.template).toBe("classic");
    expect(state.meta.pageSize).toBe("A4");
    expect(state.meta.accentHex).toBe("#1E3A5F");
  });

  it("ADD / UPDATE / REMOVE experience", () => {
    let state = emptyResume();
    state = resumeReducer(state, { type: "ADD_EXPERIENCE" });
    expect(state.experience).toHaveLength(1);
    expect(state.experience[0].company).toBe("");

    state = resumeReducer(state, {
      type: "UPDATE_EXPERIENCE",
      payload: { index: 0, value: { company: "Acme", role: "Dev" } },
    });
    expect(state.experience[0].company).toBe("Acme");
    expect(state.experience[0].role).toBe("Dev");

    state = resumeReducer(state, { type: "ADD_EXPERIENCE" });
    state = resumeReducer(state, { type: "REMOVE_EXPERIENCE", payload: 0 });
    expect(state.experience).toHaveLength(1);
    expect(state.experience[0].company).toBe("");
  });

  it("SET_EXPERIENCE replaces entire list", () => {
    const state = resumeReducer(emptyResume(), {
      type: "SET_EXPERIENCE",
      payload: sampleResume.experience,
    });
    expect(state.experience).toEqual(sampleResume.experience);
  });

  it("ADD / UPDATE / REMOVE education, certifications, projects", () => {
    let state = emptyResume();
    state = resumeReducer(state, { type: "ADD_EDUCATION" });
    state = resumeReducer(state, {
      type: "UPDATE_EDUCATION",
      payload: { index: 0, value: { school: "MIT", degree: "BS" } },
    });
    expect(state.education[0].school).toBe("MIT");
    state = resumeReducer(state, { type: "REMOVE_EDUCATION", payload: 0 });
    expect(state.education).toHaveLength(0);

    state = resumeReducer(state, { type: "ADD_CERTIFICATION" });
    state = resumeReducer(state, {
      type: "UPDATE_CERTIFICATION",
      payload: { index: 0, value: { name: "PMP" } },
    });
    expect(state.certifications?.[0].name).toBe("PMP");
    state = resumeReducer(state, { type: "REMOVE_CERTIFICATION", payload: 0 });
    expect(state.certifications).toHaveLength(0);

    state = resumeReducer(state, { type: "ADD_PROJECT" });
    state = resumeReducer(state, {
      type: "UPDATE_PROJECT",
      payload: { index: 0, value: { name: "App", description: "Desc" } },
    });
    expect(state.projects?.[0].name).toBe("App");
    state = resumeReducer(state, { type: "REMOVE_PROJECT", payload: 0 });
    expect(state.projects).toHaveLength(0);
  });

  it("REPLACE and RESET", () => {
    const replaced = resumeReducer(emptyResume(), {
      type: "REPLACE",
      payload: sampleResume,
    });
    expect(replaced).toEqual(sampleResume);

    const reset = resumeReducer(sampleResume, { type: "RESET" });
    expect(reset).toEqual(emptyResume());
  });

  it("ignores unknown action types", () => {
    const state = emptyResume();
    const next = resumeReducer(state, {
      type: "NOPE",
    } as unknown as ResumeAction);
    expect(next).toBe(state);
  });
});

describe("loadResume", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    if (typeof localStorage !== "undefined") localStorage.clear();
  });

  it("returns emptyResume when window is undefined (SSR)", () => {
    vi.stubGlobal("window", undefined);
    expect(loadResume()).toEqual(emptyResume());
  });

  it("returns emptyResume when storage empty or invalid", () => {
    const store = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => store.set(k, v),
      removeItem: (k: string) => store.delete(k),
      clear: () => store.clear(),
    });
    vi.stubGlobal("window", { localStorage: globalThis.localStorage });

    expect(loadResume()).toEqual(emptyResume());

    localStorage.setItem(STORAGE_KEY, "not-json");
    expect(loadResume()).toEqual(emptyResume());

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ contact: {} }));
    expect(loadResume()).toEqual(emptyResume());
  });

  it("loads valid resume from localStorage", () => {
    const store = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => store.set(k, v),
      removeItem: (k: string) => store.delete(k),
      clear: () => store.clear(),
    });
    vi.stubGlobal("window", { localStorage: globalThis.localStorage });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleResume));
    expect(loadResume()).toEqual(sampleResume);
  });
});

describe("persona helpers shape", () => {
  it("getPersona returns a full resume for tech", () => {
    const p = getPersona("tech");
    expect(p.meta.persona).toBe("tech");
    expect(p.contact.fullName.length).toBeGreaterThan(0);
  });
});
