const incidentRepository = require(
  "../repositories/incident.repository"
);

const createIncident = async (incidentData) => {
  const {
    category,
    location,
    dateTime,
    description,
  } = incidentData;

  if (!category || !location || !dateTime || !description) {
    throw new Error("All required fields must be provided");
  }

  const incident =
    await incidentRepository.createIncident(incidentData);

  return incident;
};

module.exports = {
  createIncident,
};