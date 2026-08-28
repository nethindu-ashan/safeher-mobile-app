export const validateSOS = (sosData) => {
  const {
    latitude,
    longitude,
    message,
  } = sosData;

  if (
    latitude === undefined ||
    longitude === undefined
  ) {
    throw new Error(
      "Latitude and longitude are required"
    );
  }

  if (typeof latitude !== "number") {
    throw new Error(
      "Latitude must be a number"
    );
  }

  if (typeof longitude !== "number") {
    throw new Error(
      "Longitude must be a number"
    );
  }

  if (latitude < -90 || latitude > 90) {
    throw new Error(
      "Invalid latitude"
    );
  }

  if (
    longitude < -180 ||
    longitude > 180
  ) {
    throw new Error(
      "Invalid longitude"
    );
  }

  if (
    message &&
    typeof message !== "string"
  ) {
    throw new Error(
      "Message must be text"
    );
  }

  if (
    message &&
    message.length > 255
  ) {
    throw new Error(
      "Message cannot exceed 255 characters"
    );
  }
};