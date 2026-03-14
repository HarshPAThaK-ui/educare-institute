const rawApiBase = import.meta.env.VITE_API_URL?.trim();

if (!rawApiBase) {
  console.warn(
    "VITE_API_URL is not set. Falling back to same-origin API requests."
  );
}

export const API_BASE = rawApiBase ? rawApiBase.replace(/\/+$/, "") : "";
