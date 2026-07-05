import {
  API_KEY_EXPIRY_STORAGE_KEY,
  API_KEY_STORAGE_KEY,
  API_KEY_TTL_MS,
} from "@/lib/constants";

function canUseSessionStorage() {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

export function getApiKeyFromSessionStorage() {
  if (!canUseSessionStorage()) {
    return "";
  }

  const expiresAt = window.sessionStorage.getItem(API_KEY_EXPIRY_STORAGE_KEY);
  if (expiresAt && Date.now() > Number(expiresAt)) {
    removeApiKeyFromSessionStorage();
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
    removeApiKeyFromSessionStorage();
    return;
  }

  window.sessionStorage.setItem(API_KEY_STORAGE_KEY, trimmedApiKey);
  window.sessionStorage.setItem(
    API_KEY_EXPIRY_STORAGE_KEY,
    String(Date.now() + API_KEY_TTL_MS),
  );
}

export function removeApiKeyFromSessionStorage() {
  if (!canUseSessionStorage()) {
    return;
  }

  window.sessionStorage.removeItem(API_KEY_STORAGE_KEY);
  window.sessionStorage.removeItem(API_KEY_EXPIRY_STORAGE_KEY);
}
