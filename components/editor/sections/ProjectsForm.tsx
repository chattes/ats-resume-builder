"use client";

import { useResume } from "@/lib/store";

const field =
  "w-full rounded-md border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none";
const label = "block text-xs font-medium text-slate-400 mb-1";

export function ProjectsForm() {
  const { resume, dispatch } = useResume();
  const projects = resume.projects ?? [];

  return (
    <div className="space-y-4">
      {projects.map((proj, i) => (
        <div
          key={i}
          className="space-y-2 rounded-lg border border-slate-700 bg-slate-900/40 p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">
              Project {i + 1}
            </span>
            <button
              type="button"
              aria-label={`Remove project ${i + 1}`}
              className="text-xs text-red-400 hover:text-red-300"
              onClick={() =>
                dispatch({ type: "REMOVE_PROJECT", payload: i })
              }
            >
              Remove
            </button>
          </div>
          <div>
            <label className={label} htmlFor={`proj-name-${i}`}>
              Name
            </label>
            <input
              id={`proj-name-${i}`}
              className={field}
              value={proj.name}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_PROJECT",
                  payload: { index: i, value: { name: e.target.value } },
                })
              }
            />
          </div>
          <div>
            <label className={label} htmlFor={`proj-desc-${i}`}>
              Description
            </label>
            <textarea
              id={`proj-desc-${i}`}
              rows={2}
              className={field}
              value={proj.description}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_PROJECT",
                  payload: {
                    index: i,
                    value: { description: e.target.value },
                  },
                })
              }
            />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Bullets</span>
              <button
                type="button"
                className="text-xs text-cyan-400 hover:text-cyan-300"
                onClick={() =>
                  dispatch({
                    type: "UPDATE_PROJECT",
                    payload: {
                      index: i,
                      value: { bullets: [...(proj.bullets ?? []), ""] },
                    },
                  })
                }
              >
                + Bullet
              </button>
            </div>
            {(proj.bullets ?? []).map((b, bi) => (
              <div key={bi} className="mb-1.5 flex gap-2">
                <input
                  aria-label={`Project ${i + 1} bullet ${bi + 1}`}
                  className={field}
                  value={b}
                  onChange={(e) => {
                    const bullets = (proj.bullets ?? []).map((x, j) =>
                      j === bi ? e.target.value : x
                    );
                    dispatch({
                      type: "UPDATE_PROJECT",
                      payload: { index: i, value: { bullets } },
                    });
                  }}
                />
                <button
                  type="button"
                  aria-label={`Remove bullet ${bi + 1}`}
                  className="shrink-0 text-xs text-red-400"
                  onClick={() => {
                    const bullets = (proj.bullets ?? []).filter(
                      (_, j) => j !== bi
                    );
                    dispatch({
                      type: "UPDATE_PROJECT",
                      payload: { index: i, value: { bullets } },
                    });
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => dispatch({ type: "ADD_PROJECT" })}
        className="w-full rounded-md border border-dashed border-slate-600 py-2 text-xs font-medium text-cyan-400 hover:border-cyan-500/50 hover:bg-slate-800/50"
      >
        + Add project
      </button>
    </div>
  );
}
