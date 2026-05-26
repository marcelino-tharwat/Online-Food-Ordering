// import { Outlet } from 'react-router-dom';
// import Navbar from '../components/Navbar';

// function MainLayout() {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navbar />
//       <main className="flex-1">
//         <Outlet />
//       </main>
//       <footer className="bg-gray-800 text-white text-center p-4">
//         <p>© 2024 Electro Pi. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// }

// export default MainLayout;
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";

function MainLayout() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-[#0b3b24] font-sans antialiased selection:bg-[#ea580c] selection:text-white text-white">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-[#0b3b24] text-gray-300 text-center py-10 px-4 border-t border-white/10">
        <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-4 text-sm font-medium">
          <p className="tracking-wide opacity-90">{t("footer.tagline")}</p>
          <p className="opacity-60 text-xs sm:text-sm font-mono">
            &copy; {currentYear} {t("footer.rights")}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
