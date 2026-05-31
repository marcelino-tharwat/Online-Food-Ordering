import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import type { RootState } from "../redux/store";
import { logout } from "../redux/slices/authSlice";
import { selectCartItemCount } from "../redux/slices/cartSlice";
import LanguageSwitcher from "./LanguageSwitcher";
import CartDrawer from "./CartDrawer";
import {
  ShoppingBag,
  User,
  LogOut,
  LayoutDashboard,
  Heart,
  Search,
  Menu as MenuIcon,
  X,
} from "lucide-react";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const cartItemCount = useSelector(selectCartItemCount);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location]);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    window.location.href = "/";
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { to: "/menu", label: t("navbar.menu") },
  ];

  if (isAuthenticated && user) {
    navLinks.push({ to: "/favorites", label: t("navbar.favorites") });
    navLinks.push({ to: "/orders", label: t("navbar.orders") });
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-border-light"
            : "bg-white border-b border-border-light"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            <Link
              to="/"
              className="flex items-center gap-2 group"
            >
              <span className="text-xl md:text-2xl font-extrabold tracking-tight text-primary group-hover:text-primary-hover transition-colors duration-300">
                {t("navbar.brand")}
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-3.5 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                    location.pathname === link.to
                      ? "text-primary bg-primary-light"
                      : "text-text-secondary hover:text-primary hover:bg-primary-light/30"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={`p-2 rounded-md text-sm font-semibold transition-all ${
                  searchOpen
                    ? "text-primary bg-primary-light"
                    : "text-text-secondary hover:text-primary hover:bg-primary-light/30"
                }`}
              >
                <Search className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 rounded-md text-text-secondary hover:text-primary hover:bg-primary-light/30 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center shadow-sm">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </span>
                )}
              </button>

              {isAuthenticated && user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="px-3 py-1.5 ml-1 rounded-md text-xs font-semibold bg-primary-light text-primary hover:bg-primary-light/80 transition-all"
                >
                  {t("navbar.adminPanel")}
                </Link>
              )}

              <div className="h-5 w-px bg-border-light mx-2" />

              {isAuthenticated && user ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold text-text-secondary hover:text-primary hover:bg-primary-light/30 transition-all"
                  >
                    <User className="w-3.5 h-3.5 text-primary" />
                    {user.name}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-md text-text-tertiary hover:text-error hover:bg-error-bg transition-all"
                    title={t("navbar.logout")}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3.5 py-2 rounded-md text-sm font-semibold text-text-secondary hover:text-primary hover:bg-primary-light/30 transition-all"
                  >
                    {t("navbar.login")}
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-md text-sm font-semibold bg-primary text-white hover:bg-primary-hover transition-all shadow-sm"
                  >
                    {t("navbar.register")}
                  </Link>
                </div>
              )}

              <div className="ms-2">
                <LanguageSwitcher />
              </div>
            </nav>

            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-md text-text-secondary hover:text-primary hover:bg-primary-light/30 transition-all"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 rounded-md text-text-secondary hover:text-primary hover:bg-primary-light/30 transition-all"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center shadow-sm">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-md text-text-secondary hover:text-primary hover:bg-primary-light/30 transition-all"
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

        {searchOpen && (
          <div className="border-t border-border-light bg-white animate-slide-down">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-3">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("navbar.searchPlaceholder")}
                    className="w-full ps-10 pe-4 py-2.5 bg-accent/30 border border-border-medium rounded-md text-text-primary placeholder:text-text-tertiary/60 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/50 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-primary transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {mobileOpen && (
          <div className="md:hidden border-t border-border-light bg-white animate-slide-down">
            <div className="px-4 py-3 space-y-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-md text-sm font-semibold transition-all ${
                    location.pathname === link.to
                      ? "text-primary bg-primary-light"
                      : "text-text-secondary hover:text-primary hover:bg-primary-light/30"
                  }`}
                >
                  <span>{link.label}</span>
                </Link>
              ))}

              <div className="h-px bg-border-light my-2" />

              {isAuthenticated && user ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-md text-sm font-semibold text-text-secondary hover:text-primary hover:bg-primary-light/30 transition-all"
                  >
                    <User className="w-4 h-4 text-primary" />
                    {user.name}
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-md text-sm font-semibold text-primary bg-primary-light hover:bg-primary-light/80 transition-all"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      {t("navbar.adminPanel")}
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-md text-sm font-semibold text-error hover:bg-error-bg transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    {t("navbar.logout")}
                  </button>
                </>
              ) : (
                <div className="flex gap-2 px-1 py-2">
                  <Link
                    to="/login"
                    className="flex-1 text-center px-4 py-2.5 rounded-md text-sm font-semibold border border-border-medium text-text-secondary hover:text-primary hover:border-primary transition-all"
                  >
                    {t("navbar.login")}
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 text-center px-4 py-2.5 rounded-md text-sm font-semibold bg-primary text-white shadow-sm transition-all"
                  >
                    {t("navbar.register")}
                  </Link>
                </div>
              )}

              <div className="px-1 pt-2">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

export default Navbar;
