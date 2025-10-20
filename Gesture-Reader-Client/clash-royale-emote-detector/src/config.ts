// Centralized configuration for API endpoints
export const API_BASE_URL: string =
  (import.meta as any).env?.VITE_API_BASE?.toString() ?? "http://localhost:5000";

export const DETECT_EMOTE_URL: string = `${API_BASE_URL}/api/emote/detect`;


