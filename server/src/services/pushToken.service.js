import {
  upsertPushToken,
  getPushTokensByUserId,
  deletePushToken,
} from "../repositories/pushToken.repository.js";

export async function registerPushToken(userId, token) {
  return await upsertPushToken(userId, token);
}

export async function getUserPushTokens(userId) {
  return await getPushTokensByUserId(userId);
}

export async function removePushToken(token) {
  return await deletePushToken(token);
}