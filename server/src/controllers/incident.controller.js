import * as incidentService from "../services/incident.service.js";

export const createIncident = async (
  req,
  res
) => {
  try {
    const authenticatedUser =
      req.authUser ??
      req.user ??
      null;

    const incidentData = {
      ...req.body,

      userId:
        authenticatedUser?.id ??
        null,
    };

    const incident =
      await incidentService.createIncident(
        incidentData
      );

    return res.status(201).json({
      success: true,
      message:
        "Incident reported successfully",
      data: incident,
    });
  } catch (error) {
    console.error(
      "Create incident controller error:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Unable to submit incident report.",
    });
  }
};

export const getNearbyIncidents = async (
  req,
  res
) => {
  try {
    const {
      latitude,
      longitude,
    } = req.query;

    const incidents =
      await incidentService.getNearbyIncidents(
        Number(latitude),
        Number(longitude)
      );

    return res.status(200).json({
      success: true,
      data: incidents,
    });
  } catch (error) {
    console.error(
      "Get nearby incidents controller error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to retrieve nearby incidents.",
    });
  }
};

export const getMyIncidents = async (
  req,
  res
) => {
  try {
    const authenticatedUser =
      req.authUser ??
      req.user ??
      null;

    if (
      !authenticatedUser?.id
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    const incidents =
      await incidentService.getMyIncidents(
        authenticatedUser.id
      );

    return res.status(200).json({
      success: true,
      data: incidents,
    });
  } catch (error) {
    console.error(
      "Get my incidents controller error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to retrieve your reports.",
    });
  }
};

/**
 * Cancel logged-in user's report.
 */
export const cancelMyIncident = async (
  req,
  res
) => {
  try {
    const authenticatedUser =
      req.authUser ??
      req.user ??
      null;

    if (
      !authenticatedUser?.id
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    const { id } = req.params;

    const incident =
      await incidentService.cancelMyIncident(
        id,
        authenticatedUser.id
      );

    return res.status(200).json({
      success: true,
      message:
        "Report cancelled successfully.",
      data: incident,
    });
  } catch (error) {
    console.error(
      "Cancel report controller error:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Unable to cancel report.",
    });
  }
};

export const getIncidentById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const incident =
      await incidentService.getIncidentById(
        id
      );

    return res.status(200).json({
      success: true,
      data: incident,
    });
  } catch (error) {
    console.error(
      "Get incident controller error:",
      error
    );

    return res.status(404).json({
      success: false,
      message:
        error.message ||
        "Unable to retrieve incident.",
    });
  }
};