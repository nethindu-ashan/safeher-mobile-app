import * as adminRepository from "../repositories/admin.repository.js";

const FILTER_STATUSES = [
  "Pending Review",
  "Verified",
  "Rejected",
  "Cancelled",
];

const ADMIN_REVIEW_STATUSES = [
  "Verified",
  "Rejected",
];

export const getIncidents = async (
  status
) => {
  if (
    status &&
    !FILTER_STATUSES.includes(
      status
    )
  ) {
    throw new Error(
      "Invalid incident status."
    );
  }

  return adminRepository.findAllIncidents(
    status
  );
};

export const getIncident = async (
  id
) => {
  const incident =
    await adminRepository.findIncidentForAdmin(
      id
    );

  if (!incident) {
    throw new Error(
      "Incident not found."
    );
  }

  return incident;
};

export const changeIncidentStatus =
  async (
    id,
    status
  ) => {
    if (
      !ADMIN_REVIEW_STATUSES.includes(
        status
      )
    ) {
      throw new Error(
        "Admin can only verify or reject a pending report."
      );
    }

    const incident =
      await adminRepository.findIncidentForAdmin(
        id
      );

    if (!incident) {
      throw new Error(
        "Incident not found."
      );
    }

    if (
      incident.status !==
      "Pending Review"
    ) {
      throw new Error(
        `This report cannot be reviewed because its current status is "${incident.status}".`
      );
    }

    return adminRepository.updateIncidentStatus(
      id,
      status
    );
  };