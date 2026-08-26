import * as incidentService from "../services/incident.service.js";

export const createIncident = async (req, res) => {
  try {
    const incident = await incidentService.createIncident(req.body);

    res.status(201).json({
      success: true,
      message: "Incident reported successfully",
      data: incident,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};