"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import { emptyResume } from "@/lib/defaults";
import { getPersona } from "@/lib/personas";
import {
  resumeSchema,
  type PersonaId,
  type Resume,
} from "@/lib/schema";

export const STORAGE_KEY = "ats-resume-builder:v1";

type Experience = Resume["experience"][number];
type Education = Resume["education"][number];
type Certification = NonNullable<Resume["certifications"]>[number];
type Project = NonNullable<Resume["projects"]>[number];

export type ResumeAction =
  | { type: "SET_CONTACT"; payload: Partial<Resume["contact"]> }
  | { type: "SET_SUMMARY"; payload: string }
  | { type: "SET_SKILLS"; payload: string[] }
  | { type: "SET_META"; payload: Partial<Resume["meta"]> }
  | { type: "SET_EXPERIENCE"; payload: Experience[] }
  | { type: "ADD_EXPERIENCE" }
  | { type: "REMOVE_EXPERIENCE"; payload: number }
  | { type: "UPDATE_EXPERIENCE"; payload: { index: number; value: Partial<Experience> } }
  | { type: "SET_EDUCATION"; payload: Education[] }
  | { type: "ADD_EDUCATION" }
  | { type: "REMOVE_EDUCATION"; payload: number }
  | { type: "UPDATE_EDUCATION"; payload: { index: number; value: Partial<Education> } }
  | { type: "SET_CERTIFICATIONS"; payload: Certification[] }
  | { type: "ADD_CERTIFICATION" }
  | { type: "REMOVE_CERTIFICATION"; payload: number }
  | {
      type: "UPDATE_CERTIFICATION";
      payload: { index: number; value: Partial<Certification> };
    }
  | { type: "SET_PROJECTS"; payload: Project[] }
  | { type: "ADD_PROJECT" }
  | { type: "REMOVE_PROJECT"; payload: number }
  | { type: "UPDATE_PROJECT"; payload: { index: number; value: Partial<Project> } }
  | { type: "REPLACE"; payload: Resume }
  | { type: "RESET" };

function emptyExperience(): Experience {
  return {
    company: "",
    role: "",
    location: "",
    start: "",
    end: "",
    bullets: [],
  };
}

function emptyEducation(): Education {
  return {
    school: "",
    degree: "",
    location: "",
    start: "",
    end: "",
    details: [],
  };
}

function emptyCertification(): Certification {
  return { name: "", issuer: "", year: "" };
}

function emptyProject(): Project {
  return { name: "", description: "", bullets: [] };
}

function updateAt<T>(list: T[], index: number, value: Partial<T>): T[] {
  return list.map((item, i) => (i === index ? { ...item, ...value } : item));
}

export function resumeReducer(state: Resume, action: ResumeAction): Resume {
  switch (action.type) {
    case "SET_CONTACT":
      return { ...state, contact: { ...state.contact, ...action.payload } };
    case "SET_SUMMARY":
      return { ...state, summary: action.payload };
    case "SET_SKILLS":
      return { ...state, skills: action.payload };
    case "SET_META":
      return { ...state, meta: { ...state.meta, ...action.payload } };
    case "SET_EXPERIENCE":
      return { ...state, experience: action.payload };
    case "ADD_EXPERIENCE":
      return { ...state, experience: [...state.experience, emptyExperience()] };
    case "REMOVE_EXPERIENCE":
      return {
        ...state,
        experience: state.experience.filter((_, i) => i !== action.payload),
      };
    case "UPDATE_EXPERIENCE":
      return {
        ...state,
        experience: updateAt(
          state.experience,
          action.payload.index,
          action.payload.value
        ),
      };
    case "SET_EDUCATION":
      return { ...state, education: action.payload };
    case "ADD_EDUCATION":
      return { ...state, education: [...state.education, emptyEducation()] };
    case "REMOVE_EDUCATION":
      return {
        ...state,
        education: state.education.filter((_, i) => i !== action.payload),
      };
    case "UPDATE_EDUCATION":
      return {
        ...state,
        education: updateAt(
          state.education,
          action.payload.index,
          action.payload.value
        ),
      };
    case "SET_CERTIFICATIONS":
      return { ...state, certifications: action.payload };
    case "ADD_CERTIFICATION":
      return {
        ...state,
        certifications: [...(state.certifications ?? []), emptyCertification()],
      };
    case "REMOVE_CERTIFICATION":
      return {
        ...state,
        certifications: (state.certifications ?? []).filter(
          (_, i) => i !== action.payload
        ),
      };
    case "UPDATE_CERTIFICATION":
      return {
        ...state,
        certifications: updateAt(
          state.certifications ?? [],
          action.payload.index,
          action.payload.value
        ),
      };
    case "SET_PROJECTS":
      return { ...state, projects: action.payload };
    case "ADD_PROJECT":
      return {
        ...state,
        projects: [...(state.projects ?? []), emptyProject()],
      };
    case "REMOVE_PROJECT":
      return {
        ...state,
        projects: (state.projects ?? []).filter((_, i) => i !== action.payload),
      };
    case "UPDATE_PROJECT":
      return {
        ...state,
        projects: updateAt(
          state.projects ?? [],
          action.payload.index,
          action.payload.value
        ),
      };
    case "REPLACE":
      return action.payload;
    case "RESET":
      return emptyResume();
    default:
      return state;
  }
}

export function loadResume(): Resume {
  if (typeof window === "undefined") return emptyResume();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyResume();
    const parsed = resumeSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : emptyResume();
  } catch {
    return emptyResume();
  }
}

type ResumeContextValue = {
  resume: Resume;
  dispatch: Dispatch<ResumeAction>;
  loadPersona: (id: PersonaId) => void;
  reset: () => void;
  exportJson: () => string;
  importJson: (raw: string) => boolean;
};

const ResumeContext = createContext<ResumeContextValue | null>(null);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resume, dispatch] = useReducer(resumeReducer, undefined, loadResume);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
    } catch {
      // ignore quota / private mode errors
    }
  }, [resume]);

  const loadPersona = useCallback((id: PersonaId) => {
    dispatch({ type: "REPLACE", payload: getPersona(id) });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const exportJson = useCallback(() => JSON.stringify(resume, null, 2), [resume]);

  const importJson = useCallback((raw: string) => {
    try {
      const parsed = resumeSchema.safeParse(JSON.parse(raw));
      if (!parsed.success) return false;
      dispatch({ type: "REPLACE", payload: parsed.data });
      return true;
    } catch {
      return false;
    }
  }, []);

  const value = useMemo(
    () => ({ resume, dispatch, loadPersona, reset, exportJson, importJson }),
    [resume, loadPersona, reset, exportJson, importJson]
  );

  return (
    <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
  );
}

export function useResume(): ResumeContextValue {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResume must be used within ResumeProvider");
  return ctx;
}
