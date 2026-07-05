import { useState } from "react";
import SideBar from "./SideBar";
import Navbar from "../Shared/Navbar";
import { Outlet } from "react-router";

const Layout = () => {
     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false); 
    return (
        <div className="min-h-screen text-slate-800 bg-slate-50/50">
            <SideBar
                isOpen={isSidebarOpen}
                closeSidebar={closeSidebar}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
            />
            <div className={`flex flex-col min-h-screen transition-all duration-300 ${isCollapsed ? 'md:pl-20' : 'md:pl-64'
                }`}>
                <Navbar toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />
                <main className="pt-18 pb-10 flex-1 px-4 md:px-6 max-w-7xl w-full mx-auto app-container">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;