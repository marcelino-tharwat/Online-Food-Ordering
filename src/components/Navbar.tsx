import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import type { RootState } from "../redux/store";
import { logout } from "../redux/slices/authSlice";
import { selectCartItemCount } from "../redux/slices/cartSlice";
import LanguageSwitcher from "./LanguageSwitcher";
import { ShoppingBag, User, LogOut, LayoutDashboard, Menu as MenuIcon, X } from "lucide-react";
import { useState, useEffect } from "react";

function Navbar() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const cartItemCount = useSelector(selectCartItemCount);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    window.location.href = "/";
  };

  const navLinks = [
    { to: "/menu", label: t("navbar.menu") },
    { to: "/cart", label: t("navbar.cart"), badge: cartItemCount },
  ];

  if (isAuthenticated && user) {
    navLinks.push({ to: "/orders", label: t("navbar.orders") });
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-surface-primary/90 backdrop-blur-xl border-b border-border-light"
          : "bg-surface-primary"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link
            to="/"
            className="flex items-center gap-2 group"
          >
            <span className="text-2xl md:text-3xl font-black font-serif tracking-tight text-text-primary group-hover:text-brand-orange transition-colors duration-300">
              {t("navbar.brand")}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 ${
                  location.pathname === link.to
                    ? "text-brand-orange bg-brand-orange/10"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                }`}
              >
                <span className="flex items-center gap-2">
                  {link.label}
                  {"badge" in link && link.badge > 0 && (
                    <span className="bg-brand-orange text-white text-[10px] font-black rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm">
                      {link.badge > 99 ? "99+" : link.badge}
                    </span>
                  )}
                </span>
              </Link>
            ))}

            {isAuthenticated && user?.role === "admin" && (
              <Link
                to="/admin"
                className="px-3 py-1.5 ml-1 rounded-lg text-xs font-bold bg-brand-orange/10 text-brand-orange border border-brand-orange/20 hover:bg-brand-orange/20 transition-all"
              >
                {t("navbar.adminPanel")}
              </Link>
            )}

            <div className="h-6 w-px bg-border-light mx-2" />

            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-text-secondary px-2 py-1 rounded-lg bg-white/5 border border-border-light">
                  <User className="w-3 h-3 inline-block mr-1 -mt-0.5" />
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-text-secondary hover:text-error hover:bg-error/10 transition-all"
                  title={t("navbar.logout")}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-bold text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
                >
                  {t("navbar.login")}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-bold bg-gradient-orange text-white shadow-md shadow-orange-900/30 hover:shadow-lg hover:shadow-orange-900/40 transition-all"
                >
                  {t("navbar.register")}
                </Link>
              </div>
            )}

            <div className="ms-2">
              <LanguageSwitcher />
            </div>
          </nav>

          <div className="flex md:hidden items-center gap-3">
            <Link
              to="/cart"
              className="relative p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-orange text-white text-[10px] font-black rounded-full min-w-[16px] h-[16px] flex items-center justify-center shadow-sm">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <MenuIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border-light animate-slide-down">
          <div className="px-4 py-4 space-y-1 bg-surface-overlay/50">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  location.pathname === link.to
                    ? "text-brand-orange bg-brand-orange/10"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                }`}
              >
                <span>{link.label}</span>
                {"badge" in link && link.badge > 0 && (
                  <span className="bg-brand-orange text-white text-[10px] font-black rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm">
                    {link.badge > 99 ? "99+" : link.badge}
                  </span>
                )}
              </Link>
            ))}

            <div className="h-px bg-border-light my-2" />

            {isAuthenticated && user ? (
              <>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-brand-orange bg-brand-orange/10 hover:bg-brand-orange/20 transition-all"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    {t("navbar.adminPanel")}
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-error hover:bg-error/10 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  {t("navbar.logout")}
                </button>
              </>
            ) : (
              <div className="flex gap-2 px-4 py-3">
                <Link
                  to="/login"
                  className="flex-1 text-center px-4 py-2.5 rounded-xl text-sm font-bold border border-border-medium text-text-secondary hover:text-text-primary hover:border-border-strong transition-all"
                >
                  {t("navbar.login")}
                </Link>
                <Link
                  to="/register"
                  className="flex-1 text-center px-4 py-2.5 rounded-xl text-sm font-bold bg-gradient-orange text-white shadow-sm transition-all"
                >
                  {t("navbar.register")}
                </Link>
              </div>
            )}

            <div className="px-4 py-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
