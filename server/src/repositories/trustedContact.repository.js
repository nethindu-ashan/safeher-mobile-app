import prisma from "../config/prisma.js";

export const getContactsByUserId = async (userId) => {
  return prisma.trustedContact.findMany({
    where: {
      userId,
    },
    orderBy: [
      {
        isPrimary: "desc",
      },
      {
        createdAt: "asc",
      },
    ],
  });
};

export const getContactById = async (id, userId) => {
  return prisma.trustedContact.findFirst({
    where: {
      id,
      userId,
    },
  });
};

export const createContact = async (userId, data) => {
  return prisma.$transaction(async (tx) => {
    const contactCount = await tx.trustedContact.count({
      where: {
        userId,
      },
    });

    const shouldBePrimary =
      contactCount === 0 || data.isPrimary === true;

    if (shouldBePrimary) {
      await tx.trustedContact.updateMany({
        where: {
          userId,
        },
        data: {
          isPrimary: false,
        },
      });
    }

    return tx.trustedContact.create({
      data: {
        userId,
        name: data.name,
        phone: data.phone,
        relationship: data.relationship || null,
        isPrimary: shouldBePrimary,
      },
    });
  });
};

export const updateContact = async (id, userId, data) => {
  return prisma.$transaction(async (tx) => {
    if (data.isPrimary === true) {
      await tx.trustedContact.updateMany({
        where: {
          userId,
        },
        data: {
          isPrimary: false,
        },
      });
    }

    return tx.trustedContact.update({
      where: {
        id,
      },
      data: {
        ...(data.name !== undefined && {
          name: data.name,
        }),
        ...(data.phone !== undefined && {
          phone: data.phone,
        }),
        ...(data.relationship !== undefined && {
          relationship: data.relationship || null,
        }),
        ...(data.isPrimary !== undefined && {
          isPrimary: data.isPrimary,
        }),
      },
    });
  });
};

export const setPrimaryContact = async (id, userId) => {
  return prisma.$transaction(async (tx) => {
    await tx.trustedContact.updateMany({
      where: {
        userId,
      },
      data: {
        isPrimary: false,
      },
    });

    return tx.trustedContact.update({
      where: {
        id,
      },
      data: {
        isPrimary: true,
      },
    });
  });
};

export const deleteContact = async (id, userId) => {
  return prisma.$transaction(async (tx) => {
    const contact = await tx.trustedContact.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!contact) {
      return null;
    }

    await tx.trustedContact.delete({
      where: {
        id,
      },
    });

    if (contact.isPrimary) {
      const nextContact = await tx.trustedContact.findFirst({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      if (nextContact) {
        await tx.trustedContact.update({
          where: {
            id: nextContact.id,
          },
          data: {
            isPrimary: true,
          },
        });
      }
    }

    return contact;
  });
};