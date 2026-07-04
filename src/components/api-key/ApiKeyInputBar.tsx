import { ChangeEvent, useEffect, useState } from "react";
import {
  getApiKeyFromSessionStorage,
  setApiKeyToSessionStorage,
} from "@/lib/api-key";

export default function ApiKeyInputBar() {
  const [apiKey, setApiKey] = useState(() => getApiKeyFromSessionStorage());

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setApiKeyToSessionStorage(apiKey);
    }, 200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [apiKey]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextApiKey = event.target.value;
    setApiKey(nextApiKey);
  };

  return (
    <section className="mb-4 rounded-xl border border-violet-100 bg-white px-3 py-2 shadow-sm">
      <label className="flex items-center gap-2 text-xs font-medium text-slate-600" htmlFor="api-key">
        <span className="shrink-0">X-API-KEY</span>
        <input
          id="api-key"
          type="password"
          value={apiKey}
          onChange={handleChange}
          className="w-full rounded-md border border-violet-200 px-2 py-1 text-xs outline-none ring-violet-300 transition focus:ring"
          placeholder="API Key 입력"
          autoComplete="off"
          spellCheck={false}
        />
      </label>
    </section>
  );
}
