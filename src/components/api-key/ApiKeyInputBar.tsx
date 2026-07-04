import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  getApiKeyFromSessionStorage,
  setApiKeyToSessionStorage,
} from "@/lib/api-key";

const API_KEY_DEBOUNCE_MS = 200;

export default function ApiKeyInputBar() {
  const [apiKey, setApiKey] = useState(() => getApiKeyFromSessionStorage());
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setApiKeyToSessionStorage(apiKey);
    }, API_KEY_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [apiKey]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextApiKey = event.target.value;
    setApiKey(nextApiKey);
  };

  return (
    <section className="w-full max-w-xs">
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
