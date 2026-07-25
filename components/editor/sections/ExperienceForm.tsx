"use client";

import { useResume } from "@/lib/store";

const field =
  "w-full rounded-md border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none";
const label = "block text-xs font-medium text-slate-400 mb-1";

export function ExperienceForm() {
  const { resume, dispatch } = useResume();

  return (
    <div className="space-y-4">
      {resume.experience.map((exp, i) => (
        <div
          key={i}
          className="space-y-2 rounded-lg border border-slate-700 bg-slate-900/40 p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">
              Role {i + 1}
            </span>
            <button
              type="button"
              aria-label={`Remove experience ${i + 1}`}
              className="text-xs text-red-400 hover:text-red-300"
              onClick={() =>
                dispatch({ type: "REMOVE_EXPERIENCE", payload: i })
              }
            >
              Remove
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor={`exp-role-${i}`}>
                Role
              </label>
              <input
                id={`exp-role-${i}`}
                className={field}
                value={exp.role}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_EXPERIENCE",
                    payload: { index: i, value: { role: e.target.value } },
                  })
                }
              />
            </div>
            <div>
              <label className={label} htmlFor={`exp-company-${i}`}>
                Company
              </label>
              <input
                id={`exp-company-${i}`}
                className={field}
                value={exp.company}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_EXPERIENCE",
                    payload: { index: i, value: { company: e.target.value } },
                  })
                }
              />
            </div>
          </div>
          <div>
            <label className={label} htmlFor={`exp-loc-${i}`}>
              Location
            </label>
            <input
              id={`exp-loc-${i}`}
              className={field}
              value={exp.location ?? ""}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_EXPERIENCE",
                  payload: { index: i, value: { location: e.target.value } },
                })
              }
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor={`exp-start-${i}`}>
                Start
              </label>
              <input
                id={`exp-start-${i}`}
                className={field}
                value={exp.start}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_EXPERIENCE",
                    payload: { index: i, value: { start: e.target.value } },
                  })
                }
                placeholder="Jan 2020"
              />
            </div>
            <div>
              <label className={label} htmlFor={`exp-end-${i}`}>
                End
              </label>
              <input
                id={`exp-end-${i}`}
                className={field}
                value={exp.end}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_EXPERIENCE",
                    payload: { index: i, value: { end: e.target.value } },
                  })
                }
                placeholder="Present"
              />
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Bullets</span>
              <button
                type="button"
                className="text-xs text-cyan-400 hover:text-cyan-300"
                onClick={() =>
                  dispatch({
                    type: "UPDATE_EXPERIENCE",
                    payload: {
                      index: i,
                      value: { bullets: [...exp.bullets, ""] },
                    },
                  })
                }
              >
                + Bullet
              </button>
            </div>
            {exp.bullets.map((b, bi) => (
              <div key={bi} className="mb-1.5 flex gap-2">
                <input
                  aria-label={`Experience ${i + 1} bullet ${bi + 1}`}
                  className={field}
                  value={b}
                  onChange={(e) => {
                    const bullets = exp.bullets.map((x, j) =>
                      j === bi ? e.target.value : x
                    );
                    dispatch({
                      type: "UPDATE_EXPERIENCE",
                      payload: { index: i, value: { bullets } },
                    });
                  }}
                />
                <button
                  type="button"
                  aria-label={`Remove bullet ${bi + 1}`}
                  className="shrink-0 text-xs text-red-400"
                  onClick={() => {
                    const bullets = exp.bullets.filter((_, j) => j !== bi);
                    dispatch({
                      type: "UPDATE_EXPERIENCE",
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
        onClick={() => dispatch({ type: "ADD_EXPERIENCE" })}
        className="w-full rounded-md border border-dashed border-slate-600 py-2 text-xs font-medium text-cyan-400 hover:border-cyan-500/50 hover:bg-slate-800/50"
      >
        + Add experience
      </button>
    </div>
  );
}
