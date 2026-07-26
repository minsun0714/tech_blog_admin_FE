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
      className="space-y-4"
    >
      <label
        className="block space-y-2 text-sm font-medium text-slate-700"
        htmlFor="api-key"
      >
        <span>X-API-KEY</span>
        <input
          id="api-key"
          type="password"
          value={apiKey}
          onChange={handleChange}
          className="h-10 w-full rounded-md border border-violet-200 px-3 py-2 text-sm outline-none ring-violet-300 transition focus:ring"
          placeholder="API Key 입력"
          autoComplete="off"
          spellCheck={false}
        />
      </label>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleRemove}
          disabled={!savedApiKey && !trimmedApiKey}
        >
          삭제
        </Button>
        <Button
          type="submit"
          variant={isSaved ? "secondary" : "default"}
          disabled={!trimmedApiKey || !hasUnsavedChanges}
        >
          {isSaved ? "저장됨" : savedApiKey ? "수정 저장" : "저장"}
        </Button>
      </div>
    </form>
  );
}
