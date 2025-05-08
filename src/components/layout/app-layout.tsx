import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Outlet } from "react-router-dom";
// import { Sidebar } from "./sidebar";
// import { Footer } from "./footer";

interface AppLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  showFooter?: boolean;
}

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-[100px]">
        {/* {showSidebar && <Sidebar />} */}
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
      {/* {showFooter && <Footer />} */}
    </div>
  );
}
