"use client";

import { useResume } from "@/lib/store";

const field =
  "w-full rounded-md border border-slate-600 bg-slate-900 px-2 py-1.5 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none";
const label = "block text-xs font-medium text-slate-400 mb-1";

export function CertificationsForm() {
  const { resume, dispatch } = useResume();
  const certs = resume.certifications ?? [];

  return (
    <div className="space-y-4">
      {certs.map((cert, i) => (
        <div
          key={i}
          className="space-y-2 rounded-lg border border-slate-700 bg-slate-900/40 p-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">
              Certification {i + 1}
            </span>
            <button
              type="button"
              aria-label={`Remove certification ${i + 1}`}
              className="text-xs text-red-400 hover:text-red-300"
              onClick={() =>
                dispatch({ type: "REMOVE_CERTIFICATION", payload: i })
              }
            >
              Remove
            </button>
          </div>
          <div>
            <label className={label} htmlFor={`cert-name-${i}`}>
              Name
            </label>
            <input
              id={`cert-name-${i}`}
              className={field}
              value={cert.name}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_CERTIFICATION",
                  payload: { index: i, value: { name: e.target.value } },
                })
              }
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor={`cert-issuer-${i}`}>
                Issuer
              </label>
              <input
                id={`cert-issuer-${i}`}
                className={field}
                value={cert.issuer ?? ""}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_CERTIFICATION",
                    payload: { index: i, value: { issuer: e.target.value } },
                  })
                }
              />
            </div>
            <div>
              <label className={label} htmlFor={`cert-year-${i}`}>
                Year
              </label>
              <input
                id={`cert-year-${i}`}
                className={field}
                value={cert.year ?? ""}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_CERTIFICATION",
                    payload: { index: i, value: { year: e.target.value } },
                  })
                }
              />
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => dispatch({ type: "ADD_CERTIFICATION" })}
        className="w-full rounded-md border border-dashed border-slate-600 py-2 text-xs font-medium text-cyan-400 hover:border-cyan-500/50 hover:bg-slate-800/50"
      >
        + Add certification
      </button>
    </div>
  );
}
