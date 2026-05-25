import { Outlet } from 'react-router-dom';

function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-2">
          <a href="/admin/dashboard" className="block p-2 hover:bg-gray-700 rounded">Dashboard</a>
          <a href="/admin/products" className="block p-2 hover:bg-gray-700 rounded">Products</a>
          <a href="/admin/orders" className="block p-2 hover:bg-gray-700 rounded">Orders</a>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
