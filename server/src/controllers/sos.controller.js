import * as sosService from "../services/sos.service.js";

export const activateSOS = async (
  req,
  res
) => {
  try {
    const sos =
      await sosService.activateSOS(
        req.body
      );

    return res.status(201).json({
      success: true,
      message:
        "Emergency SOS activated successfully",
      data: sos,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSOSById = async (
  req,
  res
) => {
  try {
    const sos =
      await sosService.getSOSById(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      data: sos,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const cancelSOS = async (
  req,
  res
) => {
  try {
    const sos =
      await sosService.cancelSOS(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      message:
        "Emergency SOS cancelled successfully",
      data: sos,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};