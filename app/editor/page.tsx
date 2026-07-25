"use client";

import { EditorShell } from "@/components/editor/EditorShell";
import { ResumeProvider } from "@/lib/store";

export default function EditorPage() {
  return (
    <ResumeProvider>
      <EditorShell />
    </ResumeProvider>
  );
}
