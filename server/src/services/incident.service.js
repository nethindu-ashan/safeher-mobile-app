import * as incidentRepository from "../repositories/incident.repository.js";

export const createIncident = async (incidentData) => {
  const {
    category,
    location,
    dateTime,
    description,
  } = incidentData;

  if (!category || !location || !dateTime || !description) {
    throw new Error("All required fields must be provided");
  }

  return await incidentRepository.createIncident(incidentData);
};