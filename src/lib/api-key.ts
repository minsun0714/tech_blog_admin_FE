const API_KEY_STORAGE_KEY = "admin-api-key";

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

  window.sessionStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
}
