import prisma from "../config/prisma.js";

export const requireAdminSOS = async (
  req,
  res,
  next
) => {
  try {
    const userId =
      req.user?.id ||
      req.authUser?.id ||
      null;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    const profile =
      await prisma.userProfile.findUnique({
        where: {
          id: userId,
        },
        select: {
          role: true,
        },
      });

    if (
      !profile ||
      profile.role !== "ADMIN"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Administrator access required.",
      });
    }

    next();
  } catch (error) {
    console.error(
      "Admin SOS authorization error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to verify administrator access.",
    });
  }
};