import prisma from "../config/prisma.js";

export const requireAdmin = async (
  req,
  res,
  next
) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const profile =
      await prisma.userProfile.findUnique({
        where: {
          id: req.user.id,
        },
        select: {
          id: true,
          role: true,
        },
      });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "User profile not found.",
      });
    }

    if (profile.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message:
          "Administrator access required.",
      });
    }

    req.adminProfile = profile;

    return next();
  } catch (error) {
    console.error(
      "Admin authorization error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to verify administrator access.",
    });
  }
};