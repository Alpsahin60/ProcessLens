import { Sidebar } from "@/components/layout/sidebar";
import { CommandPalette } from "@/components/layout/command-palette";
import { ProcessSync } from "@/components/layout/process-sync";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProcessSync />
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {children}
        </div>
      </div>
      <CommandPalette />
    </>
  );
}
