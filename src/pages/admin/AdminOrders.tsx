import { useState, useEffect } from "react";
import api from "../../api/axios";
import type { Order, OrderStatus } from "../../types";
import { Loader2, ShoppingBag, Search } from "lucide-react";
import { Button } from "../../components/ui/Button";

const statusConfig: Record<
  OrderStatus,
  { label: string; arLabel: string; color: string; dot: string }
> = {
  pending: {
    label: "Pending",
    arLabel: "قيد الانتظار",
    color: "bg-warning/10 text-warning border border-warning/20",
    dot: "bg-warning",
  },
  confirmed: {
    label: "Confirmed",
    arLabel: "تم التأكيد",
    color: "bg-info/10 text-info border border-info/20",
    dot: "bg-info",
  },
  delivered: {
    label: "Delivered",
    arLabel: "تم التوصيل",
    color: "bg-success/10 text-success border border-success/20",
    dot: "bg-success",
  },
  cancelled: {
    label: "Cancelled",
    arLabel: "ملغي",
    color: "bg-error/10 text-error border border-error/20",
    dot: "bg-error",
  },
};

const statusOptions: OrderStatus[] = [
  "pending",
  "confirmed",
  "delivered",
  "cancelled",
];

function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const currentLang = localStorage.getItem("lang") || "en";

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/orders/admin");
      setOrders(response.data.orders || response.data.data || []);
    } catch {
      setError(
        currentLang === "ar" ? "فشل في تحميل الطلبات" : "Failed to load orders",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await api.patch(`/orders/admin/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order,
        ),
      );
    } catch {
      alert(
        currentLang === "ar" ? "فشل تحديث حالة الطلب" : "Failed to update order status",
      );
    }
  };

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  const searchedOrders = filteredOrders.filter((o) => {
    const q = searchQuery.toLowerCase();
    return (
      o._id.toLowerCase().includes(q) ||
      (o.fullName || "").toLowerCase().includes(q)
    );
  });

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(
        currentLang === "ar" ? "ar-EG" : "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        },
      );
    } catch {
      return currentLang === "ar" ? "تاريخ غير صالح" : "Invalid date";
    }
  };

  const getUserDisplayName = (user: Order["user"]) => {
    if (!user) return currentLang === "ar" ? "مستخدم غير معروف" : "Unknown User";
    if (typeof user === "object" && "name" in user) return user.name;
    return currentLang === "ar" ? "مستخدم غير معروف" : "Unknown User";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-orange flex items-center justify-center shadow-lg shadow-orange-900/30">
          <ShoppingBag className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-black font-serif tracking-tight text-text-primary">
            {currentLang === "ar" ? "إدارة الطلبات" : "Orders Management"}
          </h1>
          <p className="text-xs text-text-tertiary mt-0.5">
            {currentLang === "ar"
              ? "متابعة وتحديث حالات طلبات العملاء الحالية"
              : "Monitor and update real-time customer order statuses"}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input
            type="text"
            placeholder={currentLang === "ar" ? "بحث..." : "Search orders..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full ps-9 pe-3 py-2 bg-surface-card border border-border-medium rounded-xl text-text-primary text-sm placeholder:text-text-tertiary/60 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange/50 transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(["all", ...statusOptions] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                statusFilter === status
                  ? "bg-brand-orange text-white border-brand-orange shadow-sm"
                  : "bg-white/5 text-text-secondary border-border-light hover:text-text-primary hover:bg-white/10 hover:border-border-medium"
              }`}
            >
              {status === "all"
                ? currentLang === "ar" ? "الكل" : "All"
                : currentLang === "ar"
                  ? statusConfig[status].arLabel
                  : statusConfig[status].label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="w-8 h-8 text-brand-orange animate-spin" />
        </div>
      )}

      {error && (
        <div className="bg-error/10 border border-error/20 text-error p-4 rounded-xl text-sm font-medium" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && searchedOrders.length === 0 && (
        <div className="text-center py-16 border border-border-light rounded-2xl bg-surface-card">
          <ShoppingBag className="w-10 h-10 text-text-tertiary mx-auto mb-3" />
          <p className="text-text-secondary text-sm font-medium">
            {currentLang === "ar"
              ? "لا توجد طلبات في هذا القسم حالياً"
              : "No orders found."}
          </p>
        </div>
      )}

      {!loading && !error && searchedOrders.length > 0 && (
        <div className="bg-surface-card border border-border-light rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border-light text-sm">
              <thead className="bg-surface-overlay/50">
                <tr>
                  {["Order ID", "Customer", "Total", "Payment", "Status", "Date"].map(
                    (_, i) => (
                      <th
                        key={i}
                        className={`px-5 py-3.5 text-xs font-bold text-text-tertiary uppercase tracking-wider text-start`}
                      >
                        {i === 0
                          ? currentLang === "ar" ? "رقم الطلب" : "Order ID"
                          : i === 1
                            ? currentLang === "ar" ? "العميل" : "Customer"
                            : i === 2
                              ? currentLang === "ar" ? "الإجمالي" : "Total"
                              : i === 3
                                ? currentLang === "ar" ? "طريقة الدفع" : "Payment"
                                : i === 4
                                  ? currentLang === "ar" ? "الحالة" : "Status"
                                  : currentLang === "ar" ? "التاريخ" : "Date"}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {searchedOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-4 whitespace-nowrap font-mono font-bold text-text-primary text-xs">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-text-primary text-sm font-medium">
                        {order.fullName || getUserDisplayName(order.user)}
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap font-mono font-bold text-text-primary">
                      ${order.total?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-text-secondary font-medium text-xs">
                      {order.paymentMethod || "N/A"}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="relative inline-block">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value as OrderStatus)
                          }
                          className={`px-3 py-1.5 text-[10px] font-bold rounded-lg cursor-pointer appearance-none focus:outline-none transition-all ${statusConfig[order.status].color}`}
                        >
                          {statusOptions.map((status) => (
                            <option
                              key={status}
                              value={status}
                              className="bg-surface-modal text-text-primary"
                            >
                              {currentLang === "ar"
                                ? statusConfig[status].arLabel
                                : statusConfig[status].label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs text-text-tertiary font-medium">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
