export type ActivateSOSPayload = {
  latitude: number;
  longitude: number;
  message?: string;
};

export type EmergencySOS = {
  id: string;
  latitude: number;
  longitude: number;
  message?: string | null;
  status: string;
  activatedAt: string;
  cancelledAt?: string | null;
};

export type SOSResponse = {
  success: boolean;
  message?: string;
  data: EmergencySOS;
};