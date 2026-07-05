import {
  API_KEY_EXPIRY_STORAGE_KEY,
  API_KEY_STORAGE_KEY,
  API_KEY_TTL_MS,
} from "@/lib/constants";

function canUseSessionStorage() {
  return typeof window !== "undefined" && typeof sessionStorage !== "undefined";
}

export function getApiKeyFromSessionStorage() {
  if (!canUseSessionStorage()) {
    return "";
  }

  const expiresAt = sessionStorage.getItem(API_KEY_EXPIRY_STORAGE_KEY);
  if (expiresAt && Date.now() > Number(expiresAt)) {
    removeApiKeyFromSessionStorage();
    return "";
  }

  return sessionStorage.getItem(API_KEY_STORAGE_KEY) ?? "";
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

  sessionStorage.setItem(API_KEY_STORAGE_KEY, trimmedApiKey);
  sessionStorage.setItem(
    API_KEY_EXPIRY_STORAGE_KEY,
    String(Date.now() + API_KEY_TTL_MS),
  );
}

export function removeApiKeyFromSessionStorage() {
  if (!canUseSessionStorage()) {
    return;
  }

  sessionStorage.removeItem(API_KEY_STORAGE_KEY);
  sessionStorage.removeItem(API_KEY_EXPIRY_STORAGE_KEY);
}
