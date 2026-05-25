import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white text-center p-4">
        <p>© 2024 Electro Pi. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default MainLayout;
