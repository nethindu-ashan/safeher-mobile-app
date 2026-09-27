import * as adminSosRepository from "../repositories/adminSos.repository.js";

const allowedStatuses = [
  "ACTIVE",
  "CANCELLED",
];

export const getSOSRecords = async (status) => {
  let normalizedStatus;

  if (status) {
    normalizedStatus =
      String(status).toUpperCase();

    if (
      !allowedStatuses.includes(
        normalizedStatus
      )
    ) {
      throw new Error(
        "Invalid SOS status."
      );
    }
  }

  return adminSosRepository.getSOSRecords(
    normalizedStatus
  );
};

export const getSOSById = async (id) => {
  const sos =
    await adminSosRepository.getSOSById(
      id
    );

  if (!sos) {
    throw new Error(
      "SOS record not found."
    );
  }

  return sos;
};