import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  getApiKeyFromSessionStorage,
  removeApiKeyFromSessionStorage,
  setApiKeyToSessionStorage,
} from "@/lib/api-key";

export default function ApiKeyInputBar() {
  const [apiKey, setApiKey] = useState(() => getApiKeyFromSessionStorage());
  const [savedApiKey, setSavedApiKey] = useState(() =>
    getApiKeyFromSessionStorage(),
  );
  const trimmedApiKey = apiKey.trim();
  const isSaved = trimmedApiKey !== "" && trimmedApiKey === savedApiKey;
  const hasUnsavedChanges = trimmedApiKey !== savedApiKey;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!trimmedApiKey) return;
    setApiKeyToSessionStorage(trimmedApiKey);
    setApiKey(trimmedApiKey);
    setSavedApiKey(trimmedApiKey);
  };

  const handleRemove = () => {
    removeApiKeyFromSessionStorage();
    setApiKey("");
    setSavedApiKey("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-xl items-end gap-2"
    >
      <label
        className="flex grow items-center gap-2 text-xs font-medium text-slate-600"
        htmlFor="api-key"
      >
        <span className="shrink-0">X-API-KEY</span>
        <input
          id="api-key"
          type="password"
          value={apiKey}
          onChange={handleChange}
          className="h-9 w-full rounded-md border border-violet-200 px-2 py-1 text-xs outline-none ring-violet-300 transition focus:ring"
          placeholder="API Key 입력"
          autoComplete="off"
          spellCheck={false}
        />
      </label>
      <Button
        type="submit"
        size="sm"
        variant={isSaved ? "default" : "outline"}
        disabled={!trimmedApiKey || !hasUnsavedChanges}
      >
        {isSaved ? "저장됨" : savedApiKey ? "수정" : "저장"}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleRemove}
        disabled={!savedApiKey && !trimmedApiKey}
      >
        삭제
      </Button>
    </form>
  );
}
