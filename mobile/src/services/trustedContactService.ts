import { apiRequest } from "./apiClient";

export interface TrustedContact {
  id: string;
  userId: string;
  name: string;
  phone: string;
  relationship: string | null;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TrustedContactPayload {
  name: string;
  phone: string;
  relationship?: string;
  isPrimary?: boolean;
}

interface TrustedContactsResponse {
  success: boolean;
  data: TrustedContact[];
}

interface TrustedContactResponse {
  success: boolean;
  message: string;
  data: TrustedContact;
}

interface DeleteTrustedContactResponse {
  success: boolean;
  message: string;
}

export async function getTrustedContacts() {
  return apiRequest<TrustedContactsResponse>(
    "/api/trusted-contacts"
  );
}

export async function getPrimaryTrustedContact() {
  const response = await getTrustedContacts();

  return (
    response.data.find(
      (contact) => contact.isPrimary
    ) ?? null
  );
}

export async function addTrustedContact(
  payload: TrustedContactPayload
) {
  return apiRequest<TrustedContactResponse>(
    "/api/trusted-contacts",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function updateTrustedContact(
  id: string,
  payload: TrustedContactPayload
) {
  return apiRequest<TrustedContactResponse>(
    `/api/trusted-contacts/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );
}

export async function setPrimaryTrustedContact(
  id: string
) {
  return apiRequest<TrustedContactResponse>(
    `/api/trusted-contacts/${id}/primary`,
    {
      method: "PATCH",
    }
  );
}

export async function deleteTrustedContact(
  id: string
) {
  return apiRequest<DeleteTrustedContactResponse>(
    `/api/trusted-contacts/${id}`,
    {
      method: "DELETE",
    }
  );
}