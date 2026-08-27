import * as incidentRepository from "../repositories/incident.repository.js";

export const createIncident = async (incidentData) => {
  const {
    category,
    latitude,
    longitude,
    dateTime,
    description,
  } = incidentData;

  if (
    !category ||
    latitude === undefined ||
    longitude === undefined ||
    !dateTime ||
    !description
  ) {
    throw new Error("All required fields must be provided");
  }

  if (latitude < -90 || latitude > 90) {
    throw new Error("Invalid latitude");
  }

  if (longitude < -180 || longitude > 180) {
    throw new Error("Invalid longitude");
  }

  return await incidentRepository.createIncident(incidentData);
};

export const getNearbyIncidents = async (latitude, longitude) => {
  return await incidentRepository.getNearbyIncidents(latitude, longitude);
};