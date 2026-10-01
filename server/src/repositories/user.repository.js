import prisma from "../config/prisma.js";

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
    const dLatitude =
      ((user.latitude - latitude) * Math.PI) / 180;

    const dLongitude =
      ((user.longitude - longitude) * Math.PI) / 180;

    const a =
      Math.sin(dLatitude / 2) ** 2 +
      Math.cos((latitude * Math.PI) / 180) *
        Math.cos((user.latitude * Math.PI) / 180) *
        Math.sin(dLongitude / 2) ** 2;

    const c =
      2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distanceKm = 6371 * c;

    return distanceKm <= radiusKm;
  });
}