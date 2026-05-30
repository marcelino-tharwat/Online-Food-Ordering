import { Outlet, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import { Heart } from "lucide-react";

function MainLayout() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-surface-primary selection:bg-brand-orange/30 selection:text-white">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border-light bg-surface-overlay/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <span>
                &copy; {currentYear} {t("navbar.brand")}
              </span>
              <span className="hidden sm:inline mx-2 text-border-medium">|</span>
              <span className="hidden sm:inline">{t("footer.tagline")}</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-text-tertiary">
              <Link to="/menu" className="hover:text-text-secondary transition-colors">
                {t("navbar.menu")}
              </Link>
              <span className="w-1 h-1 rounded-full bg-border-medium" />
              <span className="flex items-center gap-1">
                {t("footer.rights")}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
