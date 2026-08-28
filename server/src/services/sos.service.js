import * as sosRepository from "../repositories/sos.repository.js";
import { validateSOS } from "../validators/sos.validator.js";

export const activateSOS = async (sosData) => {
  validateSOS(sosData);

  return await sosRepository.createSOS(
    sosData
  );
};

export const getSOSById = async (id) => {
  const sos =
    await sosRepository.findSOSById(id);

  if (!sos) {
    throw new Error(
      "SOS record not found"
    );
  }

  return sos;
};

export const cancelSOS = async (id) => {
  const existingSOS =
    await sosRepository.findSOSById(id);

  if (!existingSOS) {
    throw new Error(
      "SOS record not found"
    );
  }

  if (
    existingSOS.status === "CANCELLED"
  ) {
    throw new Error(
      "SOS has already been cancelled"
    );
  }

  return await sosRepository.cancelSOS(
    id
  );
};