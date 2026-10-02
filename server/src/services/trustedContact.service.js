import * as trustedContactRepository from "../repositories/trustedContact.repository.js";

const cleanPhoneNumber = (phone) => {
  return phone.replace(/[\s()-]/g, "").trim();
};

const validatePhone = (phone) => {
  return /^\+?[0-9]{9,15}$/.test(phone);
};

export const getTrustedContacts = async (userId) => {
  if (!userId) {
    throw new Error("Authentication required.");
  }

  return trustedContactRepository.getContactsByUserId(userId);
};

export const createTrustedContact = async (userId, data) => {
  if (!userId) {
    throw new Error("Authentication required.");
  }

  if (!data.name || !data.name.trim()) {
    throw new Error("Contact name is required.");
  }

  if (!data.phone || !data.phone.trim()) {
    throw new Error("Phone number is required.");
  }

  const phone = cleanPhoneNumber(data.phone);

  if (!validatePhone(phone)) {
    throw new Error("Please enter a valid phone number.");
  }

  return trustedContactRepository.createContact(userId, {
    name: data.name.trim(),
    phone,
    relationship: data.relationship?.trim() || null,
    isPrimary: Boolean(data.isPrimary),
  });
};

export const updateTrustedContact = async (
  id,
  userId,
  data
) => {
  if (!userId) {
    throw new Error("Authentication required.");
  }

  const existingContact =
    await trustedContactRepository.getContactById(
      id,
      userId
    );

  if (!existingContact) {
    throw new Error("Trusted contact not found.");
  }

  const updateData = {};

  if (data.name !== undefined) {
    if (!data.name.trim()) {
      throw new Error("Contact name is required.");
    }

    updateData.name = data.name.trim();
  }

  if (data.phone !== undefined) {
    const phone = cleanPhoneNumber(data.phone);

    if (!validatePhone(phone)) {
      throw new Error("Please enter a valid phone number.");
    }

    updateData.phone = phone;
  }

  if (data.relationship !== undefined) {
    updateData.relationship =
      data.relationship?.trim() || null;
  }

  if (data.isPrimary !== undefined) {
    updateData.isPrimary = Boolean(data.isPrimary);
  }

  return trustedContactRepository.updateContact(
    id,
    userId,
    updateData
  );
};

export const setPrimaryTrustedContact = async (
  id,
  userId
) => {
  if (!userId) {
    throw new Error("Authentication required.");
  }

  const existingContact =
    await trustedContactRepository.getContactById(
      id,
      userId
    );

  if (!existingContact) {
    throw new Error("Trusted contact not found.");
  }

  return trustedContactRepository.setPrimaryContact(
    id,
    userId
  );
};

export const deleteTrustedContact = async (
  id,
  userId
) => {
  if (!userId) {
    throw new Error("Authentication required.");
  }

  const deletedContact =
    await trustedContactRepository.deleteContact(
      id,
      userId
    );

  if (!deletedContact) {
    throw new Error("Trusted contact not found.");
  }

  return deletedContact;
};