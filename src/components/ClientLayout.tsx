"use client";
import { DataProvider } from "./DataStore";
import { MicrosoftAuthProvider } from "./MicrosoftAuth";
import { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <MicrosoftAuthProvider>
      <DataProvider>{children}</DataProvider>
    </MicrosoftAuthProvider>
  );
}
