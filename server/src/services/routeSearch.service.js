/*
  Route Search Service

  Purpose:
  Contains the business logic for finding route options.

  Sprint 1:
  We use temporary route information.

  Later:
  This can be replaced with real Google Maps
  route information.
*/

const searchRoutes = async (startLocation, destination) => {

  /*
    Temporary route results.

    These are not stored in the database.

    They are generated only to establish the
    Sprint 1 Route Search backend workflow.
  */
  const routes = [
    {
      id: "route-1",
      name: "Route 1",
      startLocation,
      destination,
      distance: "6.2 km",
      duration: "18 min",
    },

    {
      id: "route-2",
      name: "Route 2",
      startLocation,
      destination,
      distance: "7.1 km",
      duration: "22 min",
    },

    {
      id: "route-3",
      name: "Route 3",
      startLocation,
      destination,
      distance: "5.4 km",
      duration: "15 min",
    },
  ];

  // Return the route options to the controller.
  return routes;
};

export {
  searchRoutes,
};