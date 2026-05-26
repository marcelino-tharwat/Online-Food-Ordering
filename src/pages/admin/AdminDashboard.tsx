import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api/axios";
import { ShoppingBag, Pizza, DollarSign, Loader2 } from "lucide-react";

interface Stats {
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
}

function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const currentLang = (i18n.language as "en" | "ar") || "en";

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [productsRes, ordersRes] = await Promise.all([
        api.get("/products"),
        api.get("/orders/admin"),
      ]);

      const products = productsRes.data.products || productsRes.data.data || [];
      const orders = ordersRes.data.orders || ordersRes.data.data || [];

      const totalRevenue = orders.reduce(
        (sum: number, order: { total?: number }) => sum + (order.total || 0),
        0,
      );

      setStats({
        totalOrders: orders.length,
        totalProducts: products.length,
        totalRevenue,
      });
    } catch {
      // Keep default values on error
    }
    {
      setLoading(false);
    }
  };

  const statCards = [
    {
      labelKey: "admin.totalOrders",
      value: stats.totalOrders.toLocaleString(
        currentLang === "ar" ? "ar-EG" : "en-US",
      ),
      icon: ShoppingBag,
      iconColor: "text-sky-400",
    },
    {
      labelKey: "admin.totalProducts",
      value: stats.totalProducts.toLocaleString(
        currentLang === "ar" ? "ar-EG" : "en-US",
      ),
      icon: Pizza,
      iconColor: "text-emerald-400",
    },
    {
      labelKey: "admin.totalRevenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      iconColor: "text-[#ea580c]",
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black font-serif tracking-wide text-white">
          {t("admin.dashboardOverview")}
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          {t("admin.monitoringSubtitle")}
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="w-8 h-8 text-[#ea580c] animate-spin" />
        </div>
      )}

      {/* Stats Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={stat.labelKey}
                className="border border-white/10 p-6 rounded-2xl bg-[#0b3b24] flex items-center justify-between group transition-all"
              >
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-gray-400 tracking-wide">
                    {t(stat.labelKey)}
                  </h3>
                  <p className="text-2xl font-black font-mono text-white tracking-tight">
                    {stat.value}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
                  <IconComponent className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
