import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "./NavbarComponent";

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1000);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      {isSidebarOpen && (
        // <div className="w-64 h-full fixed md:static z-10" style={{ backgroundColor: "#ff1100" }}>
        <div>
          <NavbarComponent
            onLogout={handleLogout}
            // toggleSidebar={() => setIsSidebarOpen(false)}
            // isSidebarOpen={isSidebarOpen}
          />
        </div>
      )}

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out`}
      >
        <div className="p-4 h-full overflow-auto">
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="mb-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              ☰ Open Sidebar
            </button>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}
