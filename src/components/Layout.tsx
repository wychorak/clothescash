import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Library, PlusCircle, Shirt } from 'lucide-react';
import { motion } from 'motion/react';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-transparent">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 glass-panel m-4 rounded-3xl flex flex-col overflow-hidden"
      >
        <div className="p-6 flex items-center gap-3 border-b border-pink-100/50">
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-300 to-rose-400 flex items-center justify-center text-white shadow-lg"
          >
            <Shirt size={20} />
          </motion.div>
          <h1 className="font-bold text-xl tracking-tight text-gray-800 font-display">ClothesCash</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                isActive ? 'bg-pink-100/70 shadow-sm text-pink-800 font-medium' : 'text-gray-600 hover:bg-pink-50/50'
              }`
            }
          >
            <LayoutDashboard size={20} />
            <span>Pulpit</span>
          </NavLink>
          <NavLink
            to="/library"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                isActive ? 'bg-pink-100/70 shadow-sm text-pink-800 font-medium' : 'text-gray-600 hover:bg-pink-50/50'
              }`
            }
          >
            <Library size={20} />
            <span>Biblioteka</span>
          </NavLink>
          <NavLink
            to="/add"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                isActive ? 'bg-pink-100/70 shadow-sm text-pink-800 font-medium' : 'text-gray-600 hover:bg-pink-50/50'
              }`
            }
          >
            <PlusCircle size={20} />
            <span>Dodaj produkt</span>
          </NavLink>
        </nav>

        <div className="p-4 border-t border-pink-100/50">
          <p className="text-xs text-gray-400 text-center font-japanese">ClothesCash v1.0</p>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
