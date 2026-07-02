import { ReactNode } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { Header } from "@/components/admin/Header";
import { ToastProvider } from "@/components/ui/Toast";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
          {/* Sidebar — Desktop only (mobile handled via Header drawer) */}
          <aside className="w-64 shrink-0 hidden md:block">
            <Sidebar />
          </aside>

          {/* Main Content Area */}
          <div className="flex-grow flex flex-col min-w-0">
            <Header />
            <main className="flex-grow p-6 overflow-y-auto">
              <div className="max-w-7xl mx-auto space-y-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}
