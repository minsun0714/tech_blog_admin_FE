import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function insertAtPosition(
  text: string,
  insertText: string,
  position: number,
) {
  return `${text.slice(0, position)}${insertText}${text.slice(position)}`;
}
