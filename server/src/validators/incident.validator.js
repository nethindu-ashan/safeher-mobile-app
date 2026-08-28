export const validateIncident = (incidentData) => {
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

  if (typeof latitude !== "number") {
    throw new Error("Latitude must be a number");
  }

  if (typeof longitude !== "number") {
    throw new Error("Longitude must be a number");
  }

  if (latitude < -90 || latitude > 90) {
    throw new Error("Invalid latitude");
  }

  if (longitude < -180 || longitude > 180) {
    throw new Error("Invalid longitude");
  }

  const incidentDate = new Date(dateTime);

  if (Number.isNaN(incidentDate.getTime())) {
    throw new Error("Invalid incident date and time");
  }
};

export const validateNearbyIncidents = (latitude, longitude) => {
  if (latitude === undefined || longitude === undefined) {
    throw new Error("Latitude and longitude are required");
  }

  if (typeof latitude !== "number" || Number.isNaN(latitude)) {
    throw new Error("Latitude must be a number");
  }

  if (typeof longitude !== "number" || Number.isNaN(longitude)) {
    throw new Error("Longitude must be a number");
  }

  if (latitude < -90 || latitude > 90) {
    throw new Error("Invalid latitude");
  }

  if (longitude < -180 || longitude > 180) {
    throw new Error("Invalid longitude");
  }
};