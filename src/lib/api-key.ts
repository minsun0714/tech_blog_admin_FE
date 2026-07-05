import {
  API_KEY_EXPIRY_STORAGE_KEY,
  API_KEY_STORAGE_KEY,
  API_KEY_TTL_MS,
} from "@/lib/constants";

export function getApiKeyFromSessionStorage() {
  const expiresAt = sessionStorage.getItem(API_KEY_EXPIRY_STORAGE_KEY);
  if (expiresAt && Date.now() > Number(expiresAt)) {
    removeApiKeyFromSessionStorage();
    return "";
  }

  return sessionStorage.getItem(API_KEY_STORAGE_KEY) ?? "";
}

export function setApiKeyToSessionStorage(apiKey: string) {
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
  sessionStorage.removeItem(API_KEY_STORAGE_KEY);
  sessionStorage.removeItem(API_KEY_EXPIRY_STORAGE_KEY);
}
