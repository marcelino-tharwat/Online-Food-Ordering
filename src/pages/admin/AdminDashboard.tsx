import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api/axios";
import { ShoppingBag, Pizza, DollarSign, Loader2, TrendingUp } from "lucide-react";

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
    } finally {
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
      gradient: "from-sky-500/20 to-sky-600/10",
      iconBg: "bg-sky-500/10",
      iconColor: "text-sky-400",
    },
    {
      labelKey: "admin.totalProducts",
      value: stats.totalProducts.toLocaleString(
        currentLang === "ar" ? "ar-EG" : "en-US",
      ),
      icon: Pizza,
      gradient: "from-emerald-500/20 to-emerald-600/10",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
    },
    {
      labelKey: "admin.totalRevenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      gradient: "from-orange-500/20 to-orange-600/10",
      iconBg: "bg-orange-500/10",
      iconColor: "text-brand-orange",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-orange flex items-center justify-center shadow-lg shadow-orange-900/30">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-black font-serif tracking-tight text-text-primary">
            {t("admin.dashboardOverview")}
          </h1>
          <p className="text-xs text-text-tertiary mt-0.5">
            {t("admin.monitoringSubtitle")}
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="w-8 h-8 text-brand-orange animate-spin" />
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {statCards.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={stat.labelKey}
                className={`bg-gradient-to-br ${stat.gradient} bg-surface-card border border-border-light rounded-2xl p-6 hover:border-border-medium transition-all shadow-sm hover:shadow-md`}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-text-tertiary tracking-wide uppercase">
                      {t(stat.labelKey)}
                    </h3>
                    <p className="text-2xl md:text-3xl font-black font-mono text-text-primary tracking-tight">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${stat.iconBg} border border-white/5 flex items-center justify-center`}>
                    <IconComponent className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>
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
