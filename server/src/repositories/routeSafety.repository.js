import prisma from "../config/prisma.js";

/*
  Route Safety Repository

  Purpose:
  Read incident records from the database
  for the Safe-Route Map feature.
*/

const findIncidentsInBounds = async ({
  minLatitude,
  maxLatitude,
  minLongitude,
  maxLongitude,
  sinceDate,
}) => {

  const incidents = await prisma.incident.findMany({

    /*
      Only get incidents located inside
      the requested map area.
    */
    where: {

      latitude: {
        gte: minLatitude,
        lte: maxLatitude,
      },

      longitude: {
        gte: minLongitude,
        lte: maxLongitude,
      },

      /*
        Only get recent incidents.
      */
      incidentDatetime: {
        gte: sinceDate,
      },
    },

    /*
      Newest incidents come first.
    */
    orderBy: {
      incidentDatetime: "desc",
    },

    /*
      Only retrieve fields required
      by the Safe-Route Map feature.
    */
    select: {
      id: true,
      category: true,
      latitude: true,
      longitude: true,
      incidentDatetime: true,
      description: true,
      status: true,
      createdAt: true,
    },
  });

  return incidents;
};

export {
  findIncidentsInBounds,
};