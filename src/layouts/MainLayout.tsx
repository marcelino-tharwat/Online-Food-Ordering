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
import Navbar from "../components/Navbar";

function MainLayout() {
  const currentLang = localStorage.getItem("lang") || "en";
  const currentYear = new Date().getFullYear();

  return (
    // لون أخضر ملكي موحد وصريح للموقع بالكامل دون أي تدرج أو كروت بيضاء
    <div className="min-h-screen flex flex-col bg-[#0b3b24] font-sans antialiased selection:bg-[#ea580c] selection:text-white text-white">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      {/* الفوتر مدمج تماماً بنفس اللون الأخضر، يفصله فقط خط رفيع متناسق */}
      <footer className="bg-[#0b3b24] text-gray-300 text-center py-10 px-4 border-t border-white/10">
        <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-4 text-sm font-medium">
          <p className="tracking-wide opacity-90">
            {currentLang === "ar"
              ? "🍕 شغف وحب — نطبخ بحب ونقدم بشغف"
              : "🍕 Passion & Love — Crafted with Passion, Served with Love"}
          </p>
          <p className="opacity-60 text-xs sm:text-sm font-mono">
            &copy; {currentYear}{" "}
            {currentLang === "ar"
              ? "جميع الحقوق محفوظة."
              : "All rights reserved."}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
