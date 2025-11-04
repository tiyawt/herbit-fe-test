"use client";

import React from "react";
import AuthGate from "@/components/AuthGate";
import BottomNav from "@/components/navigation/BottomNav";
import { DEFAULT_TABS } from "@/constants";

export default function FeaturesLayout({ children }) {
  return (
    <AuthGate fallback={null}>
      <main>
        {children}
        <BottomNav tabs={DEFAULT_TABS} activeColor="#FEA800" />
      </main>
    </AuthGate>
  );
}
