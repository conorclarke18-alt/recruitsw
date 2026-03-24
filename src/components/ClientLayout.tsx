"use client";
import { DataProvider } from "./DataStore";
import { MicrosoftAuthProvider } from "./MicrosoftAuth";
import { ReactNode } from "react";
import AuthGate from "./AuthGate";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGate>
      <MicrosoftAuthProvider>
        <DataProvider>{children}</DataProvider>
      </MicrosoftAuthProvider>
    </AuthGate>
  );
}
