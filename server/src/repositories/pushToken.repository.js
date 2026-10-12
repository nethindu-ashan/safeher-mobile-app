import prisma from "../config/prisma.js";

export async function upsertPushToken(userId, token) {
  return await prisma.pushToken.upsert({
    where: {
      token,
    },
    update: {
      userId,
      updatedAt: new Date(),
    },
    create: {
      userId,
      token,
    },
  });
}

export async function getPushTokensByUserId(userId) {
  return await prisma.pushToken.findMany({
    where: {
      userId,
    },
  });
}

export async function deletePushToken(token) {
  return await prisma.pushToken.delete({
    where: {
      token,
    },
  });
}

export async function getAllPushTokens() {
  return await prisma.pushToken.findMany({
    select: {
      token: true,
    },
  });
}