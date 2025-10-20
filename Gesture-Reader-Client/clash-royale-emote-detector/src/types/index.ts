export interface Landmark {
  x: number;
  y: number;
  z: number;
}

export interface HandData {
  landmarks: Landmark[];
  handedness: string;
  score: number;
}

export interface HandPayload {
  hands: HandData[];
  timestamp: number;
}

export interface EmoteResponse {
  emote: string;
  imageUrl?: string;
  confidence?: number;
  description?: string;
}

declare global {
  interface Window {
    Hands: any;
    Camera: any;
    HAND_CONNECTIONS: any;
  }
}
