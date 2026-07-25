"use client";

import { useResume } from "@/lib/store";

const field =
  "w-full rounded-md border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none";
const label = "block text-xs font-medium text-slate-400 mb-1";

export function EducationForm() {
  const { resume, dispatch } = useResume();

  return (
    <div className="space-y-4">
      {resume.education.map((edu, i) => (
        <div
          key={i}
          className="space-y-2 rounded-lg border border-slate-700 bg-slate-900/40 p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">
              Education {i + 1}
            </span>
            <button
              type="button"
              aria-label={`Remove education ${i + 1}`}
              className="text-xs text-red-400 hover:text-red-300"
              onClick={() =>
                dispatch({ type: "REMOVE_EDUCATION", payload: i })
              }
            >
              Remove
            </button>
          </div>
          <div>
            <label className={label} htmlFor={`edu-school-${i}`}>
              School
            </label>
            <input
              id={`edu-school-${i}`}
              className={field}
              value={edu.school}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_EDUCATION",
                  payload: { index: i, value: { school: e.target.value } },
                })
              }
            />
          </div>
          <div>
            <label className={label} htmlFor={`edu-degree-${i}`}>
              Degree
            </label>
            <input
              id={`edu-degree-${i}`}
              className={field}
              value={edu.degree}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_EDUCATION",
                  payload: { index: i, value: { degree: e.target.value } },
                })
              }
            />
          </div>
          <div>
            <label className={label} htmlFor={`edu-loc-${i}`}>
              Location
            </label>
            <input
              id={`edu-loc-${i}`}
              className={field}
              value={edu.location ?? ""}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_EDUCATION",
                  payload: { index: i, value: { location: e.target.value } },
                })
              }
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor={`edu-start-${i}`}>
                Start
              </label>
              <input
                id={`edu-start-${i}`}
                className={field}
                value={edu.start ?? ""}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_EDUCATION",
                    payload: { index: i, value: { start: e.target.value } },
                  })
                }
              />
            </div>
            <div>
              <label className={label} htmlFor={`edu-end-${i}`}>
                End
              </label>
              <input
                id={`edu-end-${i}`}
                className={field}
                value={edu.end}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_EDUCATION",
                    payload: { index: i, value: { end: e.target.value } },
                  })
                }
              />
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Details</span>
              <button
                type="button"
                className="text-xs text-cyan-400 hover:text-cyan-300"
                onClick={() =>
                  dispatch({
                    type: "UPDATE_EDUCATION",
                    payload: {
                      index: i,
                      value: { details: [...(edu.details ?? []), ""] },
                    },
                  })
                }
              >
                + Detail
              </button>
            </div>
            {(edu.details ?? []).map((d, di) => (
              <div key={di} className="mb-1.5 flex gap-2">
                <input
                  aria-label={`Education ${i + 1} detail ${di + 1}`}
                  className={field}
                  value={d}
                  onChange={(e) => {
                    const details = (edu.details ?? []).map((x, j) =>
                      j === di ? e.target.value : x
                    );
                    dispatch({
                      type: "UPDATE_EDUCATION",
                      payload: { index: i, value: { details } },
                    });
                  }}
                />
                <button
                  type="button"
                  aria-label={`Remove detail ${di + 1}`}
                  className="shrink-0 text-xs text-red-400"
                  onClick={() => {
                    const details = (edu.details ?? []).filter(
                      (_, j) => j !== di
                    );
                    dispatch({
                      type: "UPDATE_EDUCATION",
                      payload: { index: i, value: { details } },
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
        onClick={() => dispatch({ type: "ADD_EDUCATION" })}
        className="w-full rounded-md border border-dashed border-slate-600 py-2 text-xs font-medium text-cyan-400 hover:border-cyan-500/50 hover:bg-slate-800/50"
      >
        + Add education
      </button>
    </div>
  );
}
