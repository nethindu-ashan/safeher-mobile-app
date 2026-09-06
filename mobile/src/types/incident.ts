export type IncidentDraft = {
  category: string;
  description: string;
  latitude: number | null;
  longitude: number | null;
  dateTime: string;
  isAnonymous: boolean;
};

export type CreateIncidentPayload = {
  category: string;
  description: string;
  latitude: number;
  longitude: number;
  dateTime: string;
  isAnonymous: boolean;
};

export type Incident = {
  id: string;
  category: string;
  description: string;
  latitude: number;
  longitude: number;
  incidentDatetime: string;
  isAnonymous: boolean;
  status: string;
  createdAt: string;
};

export type CreateIncidentResponse = {
  success: boolean;
  message: string;
  data: Incident;
};