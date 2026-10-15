import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Readable message for a caught value (route errors are typed `unknown`). */
export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
