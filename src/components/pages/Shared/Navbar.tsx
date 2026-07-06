import { Bell, HelpCircle, LogOut, Menu, Search, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast, Toaster } from "sonner";
import logo from '../../../../src/images/logo.png';

const Navbar = ({ toggleSidebar, isCollapsed }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        toast.success('Logout Successfull...!!');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    };
    return (
        <div>
            <Toaster position="top-right" richColors />
            <div className={`fixed top-0 right-0 left-0 h-16 bg-white/90 backdrop-blur-sm border-b border-slate-100 flex items-center justify-between px-4 lg:px-8 z-30 transition-all duration-300 ${isCollapsed ? 'md:left-20' : 'md:left-64'}`}>

                <div className="flex items-center gap-3 flex-1 max-w-md">
                    <button
                        onClick={toggleSidebar}
                        className="md:hidden p-2 text-slate-600 hover:bg-slate-50 globalButtonRadius transition-colors"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search surveys, clients, or tags..."
                            className="w-full pl-11 pr-4 py-2.5 bg-slate-100 text-slate-700 placeholder-slate-400 globalCardRadius text-[13px] border-none focus:outline-none focus:bg-slate-200/70 transition-all duration-200"
                        />
                        <span className="absolute left-4 top-3.5 text-slate-400">
                            <Search className="w-4 h-4" />
                        </span>
                    </div> */}
                </div>

                <div className="flex items-center gap-3 sm:gap-5 ml-4">
                    <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 globalCardRadius transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 globalCardRadius ring-2 ring-white"></span>
                    </button>

                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 globalCardRadius transition-colors">
                        <HelpCircle className="w-5 h-5" />
                    </button>

                    <div className="h-8 w-px bg-slate-200 mx-1"></div>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex items-center gap-3 focus:outline-none hover:opacity-90 transition-opacity text-left"
                        >
                            {/* <div className="text-right hidden sm:block cursor-pointer">
                                <p className="text-[13px] font-bold text-slate-800 leading-tight">User Profile</p>
                                <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider mt-1">see your profile</p>
                            </div> */}
                            <div className="relative">
                                <img
                                    src={logo}
                                    alt="Admin Avatar"
                                    className="w-9 h-9 cursor-pointer rounded-full globalCardRadius object-cover ring-2 ring-blue-500/80"
                                />
                            </div>
                        </button>

                        {isOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 globalCardRadius shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200 cursor-pointer">
                                {/* <NavLink to='/user-profile' >
                                    <button onClick={() => setIsOpen(false)} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors text-left cursor-pointer">
                                        <User className="w-4 h-4 text-slate-400" />
                                        My Profile
                                    </button>
                                </NavLink> */}
                                <div className="h-px bg-slate-100 my-1"></div>
                                <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer">
                                    <LogOut className="w-4 h-4 text-rose-400" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;