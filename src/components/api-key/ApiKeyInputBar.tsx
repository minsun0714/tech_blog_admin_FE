import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  getApiKeyFromSessionStorage,
  removeApiKeyFromSessionStorage,
  setApiKeyToSessionStorage,
} from "@/lib/api-key";

export default function ApiKeyInputBar() {
  const [apiKey, setApiKey] = useState(() => getApiKeyFromSessionStorage());
  const [savedApiKey, setSavedApiKey] = useState(() => getApiKeyFromSessionStorage());
  const trimmedApiKey = apiKey.trim();
  const hasSavedApiKey = Boolean(savedApiKey);
  const hasUnsavedChanges = trimmedApiKey !== savedApiKey;

  const submitLabel = hasSavedApiKey ? (hasUnsavedChanges ? "수정" : "저장됨") : "저장";
  const statusMessage = !trimmedApiKey
    ? "API Key를 입력한 뒤 저장해주세요."
    : hasSavedApiKey
      ? hasUnsavedChanges
        ? "저장되지 않은 변경사항이 있습니다."
        : "현재 세션에 API Key가 저장되었습니다."
      : "아직 저장되지 않았습니다.";

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextApiKey = event.target.value;
    setApiKey(nextApiKey);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trimmedApiKey) {
      return;
    }

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
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl flex-col gap-1.5">
      <div className="flex items-end gap-2">
        <label className="flex grow items-center gap-2 text-xs font-medium text-slate-600" htmlFor="api-key">
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
        <Button type="submit" size="sm" disabled={!trimmedApiKey || !hasUnsavedChanges}>
          {submitLabel}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={handleRemove} disabled={!hasSavedApiKey && !trimmedApiKey}>
          삭제
        </Button>
      </div>
      <p className="pl-[82px] text-xs text-slate-500">{statusMessage}</p>
    </form>
  );
}
