import * as supportService from "../services/support.service.js";


// ============================================================
// NEARBY GOOGLE SERVICES
// ============================================================

export const getNearbySupportServices =
  async (req, res) => {
    try {
      const {
        lat,
        lng,
        type = "ALL",
        radius = 5000,
      } = req.query;

      const nearbyServices =
        await supportService
          .getNearbySupportServices(
            lat,
            lng,
            type,
            radius
          );

      return res.status(200).json({
        success: true,
        message:
          "Nearby support services retrieved successfully",
        count:
          nearbyServices.length,
        requestedType:
          String(type).toUpperCase(),
        radiusMeters:
          Number(radius),
        data:
          nearbyServices,
      });
    } catch (error) {
      console.error(
        "Nearby support service error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };


// ============================================================
// GOOGLE PLACE DETAILS
// ============================================================

export const getGooglePlaceDetails =
  async (req, res) => {
    try {
      const { placeId } =
        req.params;

      const { lat, lng } =
        req.query;

      const hasLocation =
        lat !== undefined &&
        lng !== undefined;

      const place =
        await supportService
          .getGooglePlaceDetails(
            placeId,
            hasLocation ? lat : null,
            hasLocation ? lng : null
          );

      return res.status(200).json({
        success: true,
        message:
          "Support service details retrieved successfully",
        data: place,
      });
    } catch (error) {
      console.error(
        "Google Place Details error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };