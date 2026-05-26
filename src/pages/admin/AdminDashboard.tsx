import { useState, useEffect } from 'react';
import api from '../../api/axios';

interface Stats {
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
}

function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [productsRes, ordersRes] = await Promise.all([
        api.get('/products'),
        api.get('/orders/admin'),
      ]);

      const products = productsRes.data.products || productsRes.data.data || [];
      const orders = ordersRes.data.orders || ordersRes.data.data || [];

      const totalRevenue = orders.reduce(
        (sum: number, order: { total?: number }) => sum + (order.total || 0),
        0
      );

      setStats({
        totalOrders: orders.length,
        totalProducts: products.length,
        totalRevenue,
      });
    } catch {
      // Keep default values on error
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Total Orders',
      value: stats.totalOrders,
      icon: '📦',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Total Products',
      value: stats.totalProducts,
      icon: '🍕',
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: '💰',
      color: 'bg-yellow-50 text-yellow-600',
    },
  ];

  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    {stat.label}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;