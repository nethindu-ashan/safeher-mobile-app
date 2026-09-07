import { createContext, useContext, useState, ReactNode } from "react";

import type { RouteOption } from "../services/route.service";

type RouteContextType = {
  selectedRoute: RouteOption | null;
  setSelectedRoute: (route: RouteOption | null) => void;
};

const RouteContext = createContext<RouteContextType | undefined>(
  undefined
);

export function RouteProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [selectedRoute, setSelectedRoute] =
    useState<RouteOption | null>(null);

  return (
    <RouteContext.Provider
      value={{
        selectedRoute,
        setSelectedRoute,
      }}
    >
      {children}
    </RouteContext.Provider>
  );
}

export function useRouteContext() {
  const context = useContext(RouteContext);

  if (!context) {
    throw new Error(
      "useRouteContext must be used inside RouteProvider"
    );
  }

  return context;
}