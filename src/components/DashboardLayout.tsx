import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="flex h-12 items-center border-b border-border/50 px-4">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="ml-auto flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse-glow rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">AI Engine Active</span>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6 scrollbar-thin">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
