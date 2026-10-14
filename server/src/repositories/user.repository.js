import prisma from "../config/prisma.js";
import { calculateDistance } from "../utils/distance.js";

export async function findUserProfileById(id) {
  return prisma.userProfile.findUnique({
    where: {
      id,
    },
  });
}

export async function upsertUserProfile(data) {
  return prisma.userProfile.upsert({
    where: {
      id: data.id,
    },

    update: {
      // Keep authentication email synchronized.
      // Do not overwrite fullName here because the user
      // may later edit their profile name.
      email: data.email,
    },

    create: {
      id: data.id,
      fullName: data.fullName,
      email: data.email,
    },
  });
}

export async function updateUserProfile(id, data) {
  return prisma.userProfile.update({
    where: {
      id,
    },

    data,
  });
}

export async function findUsersNearLocation(
  latitude,
  longitude,
  radiusKm
) {
  const users = await prisma.userProfile.findMany({
    where: {
      latitude: {
        not: null,
      },
      longitude: {
        not: null,
      },
    },
    include: {
      notificationPreference: true,
      pushTokens: true,
    },
  });

  return users.filter((user) => {
  const distanceKm = calculateDistance(
    latitude,
    longitude,
    user.latitude,
    user.longitude
  );

  return distanceKm <= radiusKm;
});
}