// import { useState } from 'react';
// import { Link, useLocation, Outlet } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import type { RootState } from '../redux/store';

// const menuItems = [
//   { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
//   { path: '/admin/products', label: 'Products', icon: '🍕' },
//   { path: '/admin/orders', label: 'Orders', icon: '📦' },
// ];

// function AdminLayout() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const location = useLocation();
//   const user = useSelector((state: RootState) => state.auth.user);

//   const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Mobile overlay */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-40 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 lg:transform-none ${
//           sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
//         }`}
//       >
//         <div className="flex flex-col h-full">
//           <div className="p-4 border-b border-gray-700">
//             <div className="flex items-center justify-between">
//               <h2 className="text-xl font-bold">Admin Panel</h2>
//               <button
//                 onClick={() => setSidebarOpen(false)}
//                 className="lg:hidden p-2 hover:bg-gray-700 rounded"
//               >
//                 ✕
//               </button>
//             </div>
//             {user && (
//               <p className="text-sm text-gray-400 mt-1">Welcome, {user.name}</p>
//             )}
//           </div>

//           <nav className="flex-1 p-4 space-y-2">
//             {menuItems.map((item) => (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 onClick={() => setSidebarOpen(false)}
//                 className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
//                   isActive(item.path)
//                     ? 'bg-indigo-600 text-white'
//                     : 'hover:bg-gray-700 text-gray-300'
//                 }`}
//               >
//                 <span className="text-xl">{item.icon}</span>
//                 <span className="font-medium">{item.label}</span>
//               </Link>
//             ))}
//           </nav>

//           <div className="p-4 border-t border-gray-700">
//             <Link
//               to="/"
//               className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 text-gray-300 transition-colors"
//             >
//               <span className="text-xl">🏠</span>
//               <span className="font-medium">Back to Store</span>
//             </Link>
//           </div>
//         </div>
//       </aside>

//       {/* Main content */}
//       <div className="flex-1 flex flex-col min-w-0">
//         {/* Mobile header */}
//         <header className="lg:hidden bg-white shadow-sm p-4 flex items-center gap-4">
//           <button
//             onClick={() => setSidebarOpen(true)}
//             className="p-2 hover:bg-gray-100 rounded-lg"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           </button>
//           <h1 className="font-semibold text-gray-900">Admin Panel</h1>
//         </header>

//         <main className="flex-1 p-4 lg:p-6 overflow-auto">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }

// export default AdminLayout;
import { useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Pizza,
  ShoppingBag,
  Store,
  Menu,
  X,
  User,
} from "lucide-react";
import LanguageSwitcher from "../components/LanguageSwitcher";

interface MenuItem {
  path: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
}

const menuItems: MenuItem[] = [
  { path: "/admin/dashboard", labelKey: "admin.menu.dashboard", icon: LayoutDashboard },
  { path: "/admin/products", labelKey: "admin.menu.products", icon: Pizza },
  { path: "/admin/orders", labelKey: "admin.menu.orders", icon: ShoppingBag },
];

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "en";

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <div
      className={`flex min-h-screen bg-[#0b3b24] text-white font-sans ${
        currentLang === "ar" ? "rtl" : "ltr"
      }`}
    >
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 ${
          currentLang === "ar" ? "right-0" : "left-0"
        } z-50 w-64 border-r border-white/10 bg-[#0b3b24] transform transition-transform duration-300 lg:transform-none ${
          sidebarOpen
            ? "translate-x-0"
            : currentLang === "ar"
              ? "translate-x-full lg:translate-x-0"
              : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black font-serif tracking-wide text-white">
                {t("admin.adminPanel")}
              </h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 rounded-full border border-white/10 hover:bg-white/5"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {user && (
              <div className="flex items-center gap-2 mt-4 text-xs text-gray-400 bg-white/5 p-2.5 rounded-xl border border-white/5">
                <User className="w-3.5 h-3.5 text-[#ea580c]" />
                <span className="truncate">
                  {t("admin.welcome")}, {user.name}
                </span>
              </div>
            )}
          </div>

          <nav className="flex-1 p-4 space-y-1.5 mt-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-all ${
                    active
                      ? "bg-[#ea580c] text-white shadow-sm"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <IconComponent
                    className={`w-[18px] h-[18px] ${active ? "text-white" : "text-gray-400"}`}
                  />
                  <span>{t(item.labelKey)}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <Link
              to="/"
              className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <Store className="w-[18px] h-[18px]" />
              <span>{t("common.backToStore")}</span>
            </Link>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden border-b border-white/10 bg-[#0b3b24] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 border border-white/10 rounded-xl hover:bg-white/5"
            >
              <Menu className="w-5 h-5 text-white" />
            </button>
            <h1 className="font-serif font-black text-lg tracking-wide">
              {t("admin.adminPanel")}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={() => navigate("/")}
              className="p-2 border border-white/10 rounded-xl hover:bg-white/5"
            >
              <Store className="w-4 h-4 text-gray-300" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-auto bg-[#0b3b24]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
