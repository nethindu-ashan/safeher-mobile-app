import * as adminSosService from "../services/adminSos.service.js";

export const getSOSRecords = async (
  req,
  res
) => {
  try {
    const records =
      await adminSosService.getSOSRecords(
        req.query.status
      );

    return res.status(200).json({
      success: true,
      data: records,
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
      await adminSosService.getSOSById(
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