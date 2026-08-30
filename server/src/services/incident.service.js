import * as incidentRepository from "../repositories/incident.repository.js";
import { validateIncident, validateNearbyIncidents, } from "../validators/incident.validator.js";

export const createIncident = async (incidentData) => {
  validateIncident(incidentData);

  return await incidentRepository.createIncident(
    incidentData
  );
};

const calculateDistance = (latitude1, longitude1, latitude2, longitude2) => {

  const R = 6371; // Earth's radius in kilometers

  const dLatitude = ((latitude2 - latitude1) * Math.PI) / 180;

  const dLongitude = ((longitude2 - longitude1) * Math.PI) / 180;

  const a =

    Math.sin(dLatitude / 2) ** 2 +

    Math.cos((latitude1 * Math.PI) / 180) *

      Math.cos((latitude2 * Math.PI) / 180) *

      Math.sin(dLongitude / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;

};


export const getNearbyIncidents = async (latitude, longitude) => {
  validateNearbyIncidents(latitude, longitude);
  
  const incidents = await incidentRepository.getNearbyIncidents(

    latitude,

    longitude

  );

  const nearbyIncidents = incidents.map((incident) => {

  const distance = calculateDistance(

    latitude,

    longitude,

    incident.latitude,

    incident.longitude

  );

  return {

    ...incident,

    distance,

  };

})
.filter((incident) => incident.distance <= 5); // Filter incidents within 5 km  

  return nearbyIncidents;

};

export const getIncidentById = async (id) => {
  const incident = await incidentRepository.getIncidentById(id);

  if (!incident) {
    throw new Error("Incident not found");
  }

  return incident;
};