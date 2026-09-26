import * as trustedContactService from "../services/trustedContact.service.js";

const getUserId = (req) => {
  return req.user?.id || req.authUser?.id || null;
};

export const getTrustedContacts = async (req, res) => {
  try {
    const contacts =
      await trustedContactService.getTrustedContacts(
        getUserId(req)
      );

    return res.status(200).json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const createTrustedContact = async (req, res) => {
  try {
    const contact =
      await trustedContactService.createTrustedContact(
        getUserId(req),
        req.body
      );

    return res.status(201).json({
      success: true,
      message: "Trusted contact added successfully.",
      data: contact,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateTrustedContact = async (req, res) => {
  try {
    const contact =
      await trustedContactService.updateTrustedContact(
        req.params.id,
        getUserId(req),
        req.body
      );

    return res.status(200).json({
      success: true,
      message: "Trusted contact updated successfully.",
      data: contact,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const setPrimaryTrustedContact = async (
  req,
  res
) => {
  try {
    const contact =
      await trustedContactService.setPrimaryTrustedContact(
        req.params.id,
        getUserId(req)
      );

    return res.status(200).json({
      success: true,
      message: "Primary trusted contact updated.",
      data: contact,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteTrustedContact = async (req, res) => {
  try {
    await trustedContactService.deleteTrustedContact(
      req.params.id,
      getUserId(req)
    );

    return res.status(200).json({
      success: true,
      message: "Trusted contact deleted successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};