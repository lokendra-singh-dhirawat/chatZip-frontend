import { Outlet } from "react-router";
import Header from "../misc/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "sonner";

export default function RootLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-100 text-gray-900">
        <AppSidebar className="hidden md:block w-64 shrink-0 border-r bg-white z-20 sticky top-0 h-screen" />
        <div className="flex-1 flex flex-col">
          <Header />

          <main className="flex-1 p-4 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
