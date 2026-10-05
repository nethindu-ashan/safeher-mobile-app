import * as adminService from "../services/admin.service.js";

export const getIncidents = async (
  req,
  res
) => {
  try {
    const { status } = req.query;

    const incidents =
      await adminService.getIncidents(
        status
      );

    return res.status(200).json({
      success: true,
      data: incidents,
    });
  } catch (error) {
    console.error(
      "Admin get incidents error:",
      error
    );

    return res.status(400).json({
      success: false,
      message:
        error.message ||
        "Unable to retrieve incidents.",
    });
  }
};

export const getIncident = async (
  req,
  res
) => {
  try {
    const incident =
      await adminService.getIncident(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      data: incident,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message:
        error.message ||
        "Incident not found.",
    });
  }
};

export const updateIncidentStatus =
  async (req, res) => {
    try {
      const { status } = req.body;

      const incident =
        await adminService.changeIncidentStatus(
          req.params.id,
          status
        );

      return res.status(200).json({
        success: true,
        message:
          "Incident status updated successfully.",
        data: incident,
      });
    } catch (error) {
      console.error(
        "Admin update incident error:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "Unable to update incident status.",
      });
    }
  };