import prisma from "../config/prisma.js";

export async function getNotificationPreferences(userId) {
  return await prisma.notificationPreference.findUnique({
    where: {
      userId,
    },
  });
}

export async function createNotificationPreferences(data) {
  return await prisma.notificationPreference.create({
    data,
  });
}

export async function updateNotificationPreferences(userId, data) {
  return await prisma.notificationPreference.update({
    where: {
      userId,
    },
    data,
  });
}