import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function NavbarComponent({ onLogout }) {
  const location = useLocation();
  const [storeOption, setStoreOption] = useState("");
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleStoreChange = (e) => {
    const value = e.target.value;
    setStoreOption(value);
    if (value === "category") window.location.href = "/dashboard/Category";
    if (value === "product") window.location.href = "/dashboard/Product";
  };

  const isActive = (path) =>
    location.pathname.includes(path)
      ? "bg-red-700 text-white"
      : "text-gray-200 hover:bg-red-600";


  return (
    <>
      <div
        style={{ backgroundColor: "#ff1100" }}
        className="w-64 h-screen fixed md:static z-1 transition-shadow text-white py-2 px-4 shadow-lg font-semibold overflow-hidden m-0"
      >
        <div className="flex flex-row justify-start items-center gap-4 text-2xl font-bold pt-0">
          <img className="logo" src="/KASHI AI LOGO.jpg" alt="logo" style={{width:"3rem", height:"3rem"}} />
          <span>KashiAi</span>
        </div>
        <nav className="flex-col gap-2">
          <Link to="/dashboard">
            <div className="cursor-pointer flex flex-row gap-4 items-center justify-center w-full bg-white text-red-800 font-semibold text-center px-4 py-1 rounded hover:scale-105 transition">
              <i class="fa-solid fa-user"></i>
              Dashboard
            </div>
          </Link>

          <div className="p-2 text-[1rem] border-b-2 border-gray-300 w-full rounded-[10px] cursor-pointer my-2">
            Data Management
          </div>
          <Link
            to="/dashboard/darshan"
            className={`flex justify-start items-center gap-2 px-4 py-1 rounded ${isActive("darshan")}`}
          >
            <i class="fa-solid fa-hands-praying"></i>
            Darshan
          </Link>
          <Link
            to="/dashboard/pooja"
            className={`flex justify-start items-center gap-4 px-4 py-1 rounded ${isActive("pooja")}`}
          >
            <i class="fa-solid fa-person-praying"></i>
            Pooja
          </Link>
          
          <Link
            to="/dashboard/yatra"
            className={`flex justify-start items-center gap-4 px-4 py-1 rounded ${isActive("yatra")}`}
          >
            <img src="/yatra.webp" style={{height:'22px', width:"20px", backgroundColor:"white", borderRadius:"100px"}}></img>
            Yatra
          </Link>

          <Link
            to="/dashboard/pandit"
            className={`flex justify-start items-center gap-4 px-4 py-1 rounded ${isActive("pandit")}`}
          >
            <img src="/pandit.webp" style={{height:'22px', width:"20px", backgroundColor:"white", borderRadius:"100px"}}></img>
            Pandit Ji
          </Link>
          <Link
            to="/dashboard/store"
            className={`flex justify-start items-center gap-4 px-4 py-1 rounded ${isActive("store")}`}
          >
            <i class="fa-solid fa-store"></i>
            Store
          </Link>
          <Link
            to="/dashboard/astro"
            className={`flex justify-start items-center gap-4 px-4 py-1 rounded ${isActive("astro")}`}
          >
            <i class="fa-solid fa-globe"></i>
            Astro
          </Link>
          <Link
            to="/dashboard/keys"
            className={`flex justify-start items-center gap-4 px-4 py-1 rounded ${isActive("keys")}`}
          >
            <i class="fa-solid fa-key"></i>
            Keys
          </Link>
          <Link
            to="/dashboard/credit"
            className={`flex justify-start items-center gap-4 px-4 py-1 rounded ${isActive("credit")}`}
          >
            <i class="fa-regular fa-credit-card"></i>
            Credit
          </Link>

          <div className="p-2 text-[1rem] border-b-2 border-gray-300 w-full rounded-[10px] cursor-pointer">
            User Monitoring
          </div>
          <Link
            to="/dashboard/users"
            className={`flex justify-start items-center gap-4 px-4 py-1 rounded ${isActive("users")}`}
          >
            <i class="fa-solid fa-user"></i>
            Users
          </Link>
         
          <Link
            to="/dashboard/payments"
            className={`flex justify-start items-center gap-4 px-4 py-1 rounded ${isActive("payments")}`}
          >
            <i class="fa-solid fa-file-invoice-dollar"></i>
            Payments
          </Link>
          <Link
            to="/dashboard/notifications"
            className={`flex justify-start items-center gap-4 px-4 py-1 rounded ${isActive("notifications")}`}
          >
            <i class="fa-solid fa-bell"></i>
            Notifications
          </Link>
          <div className="flex flex-col bottom-0 absolute mb-2 ">
            <button onClick={onLogout}>
              <div className="flex flex-row items-center justify-center gap-4 bg-transparent text-white font-semibold text-center px-4 py-1 rounded hover:scale-105 transition border-2 border-white min-w-[64]">
                <i class="fa-solid fa-arrow-left"></i>
                Logout
              </div>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}

export default NavbarComponent;
