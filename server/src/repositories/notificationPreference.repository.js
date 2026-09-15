import prisma from "../config/prisma.js";

export async function getNotificationPreferences() {
  return await prisma.notificationPreference.findFirst();
}

export async function createNotificationPreferences(data) {
  return await prisma.notificationPreference.create({
    data,
  });
}

export async function updateNotificationPreferences(id, data) {
  return await prisma.notificationPreference.update({
    where: { id },
    data,
  });
}