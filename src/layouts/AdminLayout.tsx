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
  ChevronLeft,
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

  const getPageTitle = () => {
    const active = menuItems.find((item) => isActive(item.path));
    return active ? t(active.labelKey) : t("admin.adminPanel");
  };

  return (
    <div
      className={`flex min-h-screen bg-surface-primary text-text-primary ${
        currentLang === "ar" ? "rtl" : "ltr"
      }`}
    >
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 ${
          currentLang === "ar" ? "right-0" : "left-0"
        } z-50 w-64 border-r border-border-light bg-surface-overlay/80 backdrop-blur-xl transform transition-transform duration-300 lg:transform-none ${
          sidebarOpen
            ? "translate-x-0"
            : currentLang === "ar"
              ? "translate-x-full lg:translate-x-0"
              : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-border-light">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black font-serif tracking-wide">
                <span className="text-gradient-orange">{t("admin.adminPanel")}</span>
              </h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 rounded-xl border border-border-medium hover:bg-white/5 transition-all"
              >
                <X className="w-4 h-4 text-text-secondary" />
              </button>
            </div>

            {user && (
              <div className="flex items-center gap-2.5 mt-4 text-xs text-text-secondary bg-white/[0.03] p-2.5 rounded-xl border border-border-light">
                <div className="w-6 h-6 rounded-lg bg-brand-orange/10 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-brand-orange" />
                </div>
                <span className="truncate font-medium">
                  {t("admin.welcome")}, {user.name}
                </span>
              </div>
            )}
          </div>

          <nav className="flex-1 p-3 space-y-1 mt-1">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all ${
                    active
                      ? "bg-gradient-orange text-white shadow-md shadow-orange-900/30"
                      : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                  }`}
                >
                  <IconComponent className={`w-[18px] h-[18px]`} />
                  <span>{t(item.labelKey)}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-border-light mt-auto">
            <Link
              to="/"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
            >
              <Store className="w-[18px] h-[18px]" />
              <span>{t("common.backToStore")}</span>
            </Link>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 lg:static border-b border-border-light bg-surface-primary/80 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 md:px-6 h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl border border-border-medium hover:bg-white/5 transition-all"
              >
                <Menu className="w-5 h-5 text-text-secondary" />
              </button>
              <h1 className="text-lg font-black font-serif tracking-wide hidden sm:block">
                {getPageTitle()}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <button
                onClick={() => navigate("/")}
                className="p-2 rounded-xl border border-border-medium hover:bg-white/5 transition-all"
                title={t("common.backToStore")}
              >
                <Store className="w-4 h-4 text-text-secondary" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-auto bg-gradient-dark">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
