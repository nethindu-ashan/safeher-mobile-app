import { supabase } from "../config/supabase.js";

/**
 * Extract Bearer token from Authorization header.
 */
const getBearerToken = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return null;
  }

  if (!authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.substring(7).trim();
};

/**
 * Verify Supabase JWT and return authenticated user.
 */
const verifyToken = async (token) => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return null;
  }

  return user;
};

/**
 * Required authentication.
 */
export const requireAuth = async (
  req,
  res,
  next
) => {
  try {
    const token = getBearerToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const user = await verifyToken(token);

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid or expired authentication token.",
      });
    }

    // Set both to avoid any naming conflict.
    req.user = user;
    req.authUser = user;

    console.log(
      "REQUIRE AUTH USER:",
      user.id,
      user.email
    );

    return next();
  } catch (error) {
    console.error(
      "requireAuth middleware error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to verify authentication.",
    });
  }
};

/**
 * Optional authentication.
 *
 * Guest request:
 * req.user = null
 *
 * Logged-in request:
 * verified Supabase user
 */
export const optionalAuth = async (
  req,
  res,
  next
) => {
  try {
    console.log(
      "OPTIONAL AUTH HEADER EXISTS:",
      Boolean(req.headers.authorization)
    );

    const token = getBearerToken(req);

    // Guest request
    if (!token) {
      req.user = null;
      req.authUser = null;

      console.log(
        "OPTIONAL AUTH: guest user"
      );

      return next();
    }

    const user = await verifyToken(token);

    if (!user) {
      console.log(
        "OPTIONAL AUTH: invalid token"
      );

      return res.status(401).json({
        success: false,
        message:
          "Invalid or expired authentication token.",
      });
    }

    req.user = user;
    req.authUser = user;

    console.log(
      "OPTIONAL AUTH USER:",
      user.id,
      user.email
    );

    return next();
  } catch (error) {
    console.error(
      "optionalAuth middleware error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to verify authentication.",
    });
  }
};