import * as incidentRepository from "../repositories/incident.repository.js";
import { validateIncident } from "../validators/incident.validator.js";

export const createIncident = async (incidentData) => {
  validateIncident(incidentData);

  return await incidentRepository.createIncident(
    incidentData
  );
};

export const getNearbyIncidents = async () => {
  return await incidentRepository.getNearbyIncidents();
};