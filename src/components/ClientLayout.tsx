"use client";
import { DataProvider } from "./DataStore";
import { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return <DataProvider>{children}</DataProvider>;
}
