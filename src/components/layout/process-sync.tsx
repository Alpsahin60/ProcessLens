"use client";

import { useEffect } from "react";
import { getProcesses } from "@/lib/api";
import { useAppStore } from "@/store/app-store";

export function ProcessSync() {
  const setProcesses = useAppStore((state) => state.setProcesses);

  useEffect(() => {
    let active = true;

    getProcesses().then((processes) => {
      if (active) {
        setProcesses(processes);
      }
    });

    return () => {
      active = false;
    };
  }, [setProcesses]);

  return null;
}
