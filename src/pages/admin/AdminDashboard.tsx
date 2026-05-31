import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { ShoppingBag, Pizza, DollarSign, Loader2, TrendingUp, ExternalLink, Calendar, User } from "lucide-react";

interface Stats {
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
}

interface RecentOrder {
  _id: string;
  status: string;
  total: number;
  fullName: string;
  createdAt: string;
}

function AdminDashboard() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
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
      const sorted = [...orders].sort(
        (a: { createdAt: string }, b: { createdAt: string }) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setRecentOrders(sorted.slice(0, 5));
    } catch {
      // Keep default values on error
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(
        currentLang === "ar" ? "ar-EG" : "en-US",
        { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" },
      );
    } catch {
      return "";
    }
  };

  const statCards = [
    {
      labelKey: "admin.totalOrders",
      value: stats.totalOrders.toLocaleString(
        currentLang === "ar" ? "ar-EG" : "en-US",
      ),
      icon: ShoppingBag,
      iconBg: "bg-primary-light",
      iconColor: "text-primary",
    },
    {
      labelKey: "admin.totalProducts",
      value: stats.totalProducts.toLocaleString(
        currentLang === "ar" ? "ar-EG" : "en-US",
      ),
      icon: Pizza,
      iconBg: "bg-primary-light",
      iconColor: "text-primary",
    },
    {
      labelKey: "admin.totalRevenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      iconBg: "bg-primary-light",
      iconColor: "text-primary",
    },
  ];

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-warning/10 text-warning border border-warning/20",
      confirmed: "bg-info/10 text-info border border-info/20",
      delivered: "bg-success/10 text-success border border-success/20",
      cancelled: "bg-error/10 text-error border border-error/20",
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-sm">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-text-primary">
            {t("admin.dashboardOverview")}
          </h1>
          <p className="text-xs text-text-tertiary mt-0.5">
            {t("admin.monitoringSubtitle")}
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      )}

      {!loading && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {statCards.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={stat.labelKey}
                  className="bg-white border border-border-light rounded-2xl p-6 hover:border-primary/30 transition-all shadow-sm"
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
                    <div className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                      <IconComponent className={`w-5 h-5 ${stat.iconColor}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {recentOrders.length > 0 && (
            <div className="bg-white border border-border-light rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-border-light flex items-center justify-between">
                <h3 className="text-sm font-bold text-text-primary">
                  {currentLang === "ar" ? "آخر الطلبات" : "Recent Orders"}
                </h3>
                <button
                  onClick={() => navigate("/admin/orders")}
                  className="text-xs font-bold text-primary hover:text-primary-hover transition-colors flex items-center gap-1"
                >
                  {currentLang === "ar" ? "عرض الكل" : "View All"}
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
              <div className="divide-y divide-border-light">
                {recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="px-6 py-3.5 flex items-center justify-between hover:bg-accent/20 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="font-mono text-xs font-bold tracking-wider text-text-primary">
                          #{order._id.slice(-6).toUpperCase()}
                        </span>
                        <span className="text-[10px] text-text-tertiary mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-text-secondary flex items-center gap-1">
                        <User className="w-3 h-3 text-primary" />
                        {order.fullName?.split(" ")[0] || "-"}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${statusBadge(order.status)}`}>
                        {order.status}
                      </span>
                      <span className="text-sm font-bold font-mono text-primary">
                        ${order.total?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
