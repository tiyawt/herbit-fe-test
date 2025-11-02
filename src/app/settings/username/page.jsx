"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const CURRENT_USERNAME = "dhiahnew";

function StatusIcon({ success }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {success ? (
        <path
          d="M20 6 9 17l-5-5"
          stroke="#16A34A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="m15 9-6 6m0-6 6 6"
          stroke="#F87171"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export default function EditUsernamePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const trimmed = username.trim();
  const isValid =
    trimmed.length > 1 && !trimmed.includes(" ") && !trimmed.includes("@");
  const suggestions = useMemo(
    () => ["herbit.daily", "herbit.hijau", "herbit_friend", "theherbit"],
    []
  );

  const handleBack = useCallback(() => router.back(), [router]);
  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      if (!isValid) return;
      const nextUsername = `@${trimmed}`;
      // TODO: Integrasi update username dengan nextUsername
    },
    [isValid, trimmed]
  );

  return (
    <main className="min-h-screen bg-white text-[#0A0A19]">
      <form className="flex min-h-screen flex-col" onSubmit={handleSubmit}>
        <header
          className="px-4 border-b border-gray-200"
          style={{ paddingTop: "calc(24px + env(safe-area-inset-top))" }}
        >
          <div className="flex min-h-12 items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="text-sm font-semibold text-gray-500 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FACC15]/40"
            >
              Batal
            </button>
            <span className="text-base font-semibold">Perbarui username</span>
            <button
              type="submit"
              className="text-sm font-semibold text-[#4A2D8B] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1DA1F2]/40"
            >
              Selesai
            </button>
          </div>
        </header>

        <section className="flex-1 px-4 pb-10">
          <div className="py-6">
            <p className="text-sm font-semibold text-gray-900">Saat ini</p>
            <p className="mt-2 text-base font-medium text-gray-600">
              @{CURRENT_USERNAME}
            </p>
          </div>

          <div className="py-6">
            <p className="text-sm font-semibold text-gray-900">Baru</p>
            <label
              className={`mt-4 flex items-center gap-2 border-b pb-2 text-base transition focus-within:border-[#34A853] ${
                trimmed.length > 1 ? "border-[#34A853]" : "border-gray-200"
              }`}
            >
              <span className="text-base font-medium text-gray-400">@</span>
              <input
                type="text"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value.replace(/^@+/, ""))
                }
                className="flex-1 bg-transparent text-[#0A0A19] placeholder:text-gray-400 focus:outline-none"
                placeholder="username"
              />
              {trimmed.length > 1 && <StatusIcon success={isValid} />}
            </label>
            {!isValid && trimmed.length > 1 && (
              <p className="mt-3 text-sm text-[#F87171]">
                Username tidak valid. Gunakan huruf, angka, atau underscore
                tanpa spasi.
              </p>
            )}
          </div>

          <div className="py-6">
            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              <span className="text-gray-500">Saran:</span>
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setUsername(suggestion.replace(/^@+/, ""))}
                  className="text-[#4A2D8B] transition hover:underline"
                >
                  @{suggestion}
                  {index < suggestions.length - 1 ? "," : ""}
                </button>
              ))}
            </div>
          </div>
        </section>
      </form>
    </main>
  );
}
