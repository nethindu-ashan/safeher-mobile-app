export interface IncidentEvidence {
  uri: string;
  fileName: string | null;
  mimeType: string | null;
}

export interface IncidentDraft {
  category: string;

  latitude:
    | number
    | null;

  longitude:
    | number
    | null;

  dateTime: string;

  description: string;

  isAnonymous: boolean;

  evidence: IncidentEvidence[];
}

export interface CreateIncidentPayload {
  category: string;

  latitude: number;

  longitude: number;

  dateTime: string;

  description: string;

  isAnonymous: boolean;

  evidencePaths?: string[];
}

export interface Incident {
  id: string;

  category: string;

  latitude: number;

  longitude: number;

  incidentDatetime: string;

  description: string;

  isAnonymous: boolean;

  status: string;

  createdAt: string;

  evidencePaths?: string[];
}

export interface CreateIncidentResponse {
  success: boolean;

  message: string;

  data: Incident;
}