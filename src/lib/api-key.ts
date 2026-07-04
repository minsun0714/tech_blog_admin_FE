const API_KEY_STORAGE_KEY = "apiKey";

function canUseSessionStorage() {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

export function getApiKeyFromSessionStorage() {
  if (!canUseSessionStorage()) {
    return "";
  }

  return window.sessionStorage.getItem(API_KEY_STORAGE_KEY) ?? "";
}

export function setApiKeyToSessionStorage(apiKey: string) {
  if (!canUseSessionStorage()) {
    return;
  }

  const trimmedApiKey = apiKey.trim();

  if (!trimmedApiKey) {
    window.sessionStorage.removeItem(API_KEY_STORAGE_KEY);
    return;
  }

  window.sessionStorage.setItem(API_KEY_STORAGE_KEY, trimmedApiKey);
}

export function removeApiKeyFromSessionStorage() {
  if (!canUseSessionStorage()) {
    return;
  }

  window.sessionStorage.removeItem(API_KEY_STORAGE_KEY);
}
