import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";

import { IncidentDraft } from "../types/incident";

type IncidentReportContextType = {
  draft: IncidentDraft;

  updateDraft: (
    values: Partial<IncidentDraft>
  ) => void;

  resetDraft: () => void;
};

const createInitialDraft = (): IncidentDraft => ({
  category: "",
  description: "",
  latitude: null,
  longitude: null,
  dateTime: new Date().toISOString(),
  isAnonymous: true,
});

const IncidentReportContext =
  createContext<IncidentReportContextType | undefined>(
    undefined
  );

export function IncidentReportProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [draft, setDraft] =
    useState<IncidentDraft>(createInitialDraft());

  const updateDraft = (
    values: Partial<IncidentDraft>
  ) => {
    setDraft((current) => ({
      ...current,
      ...values,
    }));
  };

  const resetDraft = () => {
    setDraft(createInitialDraft());
  };

  return (
    <IncidentReportContext.Provider
      value={{
        draft,
        updateDraft,
        resetDraft,
      }}
    >
      {children}
    </IncidentReportContext.Provider>
  );
}

export function useIncidentReport() {
  const context = useContext(IncidentReportContext);

  if (!context) {
    throw new Error(
      "useIncidentReport must be used inside IncidentReportProvider"
    );
  }

  return context;
}