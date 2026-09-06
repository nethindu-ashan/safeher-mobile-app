import { Stack } from "expo-router";

import {
  IncidentReportProvider,
} from "../../src/context/IncidentReportContext";

export default function ReportLayout() {
  return (
    <IncidentReportProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </IncidentReportProvider>
  );
}