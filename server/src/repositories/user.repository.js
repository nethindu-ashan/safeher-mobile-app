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