
import { Router } from "express";

const router = Router();

const getGoogleKey = () => process.env.GOOGLE_MAPS_API_KEY;

// GET /api/places/autocomplete?input=Divulapitiya
router.get("/autocomplete", async (req, res) => {
  try {
    const input = String(req.query.input ?? "").trim();

    if (input.length < 2) {
      return res.json({ success: true, data: [] });
    }

    if (input.length > 120) {
      return res.status(400).json({
        success: false,
        message: "Search text is too long.",
      });
    }

    const apiKey = getGoogleKey();

    if (!apiKey) {
      return res.status(503).json({
        success: false,
        message: "Google Places API key is missing.",
      });
    }

    const latitude = Number(req.query.latitude);
    const longitude = Number(req.query.longitude);

    const hasLocation =
      req.query.latitude !== undefined &&
      req.query.longitude !== undefined &&
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      Math.abs(latitude) <= 90 &&
      Math.abs(longitude) <= 180;

    const token = String(req.query.sessionToken ?? "");

    const validToken =
      /^[A-Za-z0-9_-]{1,36}$/.test(token);

    const body = {
      input,
      includedRegionCodes: ["lk"],
      languageCode: "en",

      ...(validToken
        ? { sessionToken: token }
        : {}),

      ...(hasLocation
        ? {
            locationBias: {
              circle: {
                center: { latitude, longitude },
                radius: 30000,
              },
            },
          }
        : {}),
    };

    const googleResponse = await fetch(
      "https://places.googleapis.com/v1/places:autocomplete",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(10000),
      }
    );

    const result = await googleResponse.json();

    if (!googleResponse.ok) {
      console.error(
        "Google Places autocomplete error:",
        result.error ?? result
      );

      return res.status(502).json({
        success: false,
        message: "Unable to load destination suggestions.",
      });
    }

    const suggestions = (result.suggestions ?? [])
      .filter((item) => item.placePrediction)
      .map((item) => {
        const place = item.placePrediction;

        return {
          placeId: place.placeId,
          title:
            place.structuredFormat?.mainText?.text ??
            place.text?.text ??
            "",
          subtitle:
            place.structuredFormat?.secondaryText?.text ??
            "",
          description: place.text?.text ?? "",
          types: place.types ?? [],
        };
      });

    return res.json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    console.error("Autocomplete server error:", error);

    return res.status(500).json({
      success: false,
      message: "Destination search failed.",
    });
  }
});

// GET /api/places/details/:placeId
router.get("/details/:placeId", async (req, res) => {
  try {
    const placeId = String(req.params.placeId ?? "");

    if (!placeId || placeId.length > 200) {
      return res.status(400).json({
        success: false,
        message: "Invalid place ID.",
      });
    }

    const apiKey = getGoogleKey();

    if (!apiKey) {
      return res.status(503).json({
        success: false,
        message: "Google Places API key is missing.",
      });
    }

    const token = String(req.query.sessionToken ?? "");
    const validToken =
      /^[A-Za-z0-9_-]{1,36}$/.test(token);

    const params = new URLSearchParams();

    if (validToken) {
      params.set("sessionToken", token);
    }

    const query = params.toString();

    const url =
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}` +
      (query ? `?${query}` : "");

    const googleResponse = await fetch(url, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "id,location,formattedAddress",
      },
      signal: AbortSignal.timeout(10000),
    });

    const result = await googleResponse.json();

    if (!googleResponse.ok) {
      console.error(
        "Google Place Details error:",
        result.error ?? result
      );

      return res.status(502).json({
        success: false,
        message: "Unable to retrieve destination coordinates.",
      });
    }

    if (
      !Number.isFinite(result.location?.latitude) ||
      !Number.isFinite(result.location?.longitude)
    ) {
      return res.status(502).json({
        success: false,
        message: "Coordinates are not available for this place.",
      });
    }

    return res.json({
      success: true,
      data: {
        placeId: result.id,
        address: result.formattedAddress ?? "",
        latitude: result.location.latitude,
        longitude: result.location.longitude,
      },
    });
  } catch (error) {
    console.error("Place Details server error:", error);

    return res.status(500).json({
      success: false,
      message: "Destination details request failed.",
    });
  }
});

export default router;
