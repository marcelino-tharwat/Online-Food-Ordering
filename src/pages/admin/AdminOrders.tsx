import { useState, useEffect } from "react";
import api from "../../api/axios";
import type { Order, OrderStatus } from "../../types";
import { Loader2 } from "lucide-react";

const statusConfig: Record<
  OrderStatus,
  { label: string; arLabel: string; color: string }
> = {
  pending: {
    label: "Pending",
    arLabel: "قيد الانتظار",
    color: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  },
  confirmed: {
    label: "Confirmed",
    arLabel: "تم التأكيد",
    color: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  },
  delivered: {
    label: "Delivered",
    arLabel: "تم التوصيل",
    color: "bg-green-500/10 text-green-400 border border-green-500/20",
  },
  cancelled: {
    label: "Cancelled",
    arLabel: "ملغي",
    color: "bg-red-500/10 text-red-400 border border-red-500/20",
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

  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus,
  ) => {
    try {
      await api.patch(`/orders/admin/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order,
        ),
      );
    } catch {
      alert(
        currentLang === "ar"
          ? "فشل تحديث حالة الطلب"
          : "Failed to update order status",
      );
    }
  };

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

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

  // Safely get user display name - handles both object (populated) and string (unpopulated)
  const getUserDisplayName = (user: Order["user"]) => {
    if (!user) {
      return currentLang === "ar" ? "مستخدم غير معروف" : "Unknown User";
    }
    if (typeof user === "object" && "name" in user) {
      return user.name;
    }
    return currentLang === "ar" ? "مستخدم غير معروف" : "Unknown User";
  };

  // Safely get user email
  // const getUserEmail = (user: Order["user"]) => {
  //   if (!user) {
  //     return "N/A";
  //   }
  //   if (typeof user === "object" && "email" in user) {
  //     return user.email;
  //   }
  //   return "N/A";
  // };

  return (
    <div className="space-y-8 font-sans text-white">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black font-serif tracking-wide">
          {currentLang === "ar" ? "إدارة الطلبات" : "Orders Management"}
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          {currentLang === "ar"
            ? "متابعة وتحديث حالات طلبات العملاء الحالية"
            : "Monitor and update real-time customer order statuses"}
        </p>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-white/5">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition-all border ${
            statusFilter === "all"
              ? "bg-[#ea580c] text-white border-[#ea580c]"
              : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white"
          }`}
        >
          {currentLang === "ar" ? "الكل" : "All"}
        </button>
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all border ${
              statusFilter === status
                ? "bg-[#ea580c] text-white border-[#ea580c]"
                : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white"
            }`}
          >
            {currentLang === "ar"
              ? statusConfig[status].arLabel
              : statusConfig[status].label}
          </button>
        ))}
      </div>

      {/* States Views */}
      {loading && (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="w-8 h-8 text-[#ea580c] animate-spin" />
        </div>
      )}

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {!loading && !error && filteredOrders.length === 0 && (
        <div className="text-center py-16 border border-white/10 rounded-2xl bg-white/5 text-gray-400 text-sm">
          {currentLang === "ar"
            ? "لا توجد طلبات في هذا القسم حالياً"
            : "No orders found."}
        </div>
      )}

      {!loading && !error && filteredOrders.length > 0 && (
        <div className="border border-white/10 rounded-2xl bg-[#0b3b24] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/5 text-sm">
              <thead className="bg-white/5 text-gray-400 font-bold uppercase tracking-wider text-xs">
                <tr>
                  <th
                    className={`px-6 py-4 ${currentLang === "ar" ? "text-right" : "text-left"}`}
                  >
                    {currentLang === "ar" ? "رقم الطلب" : "Order ID"}
                  </th>
                  <th
                    className={`px-6 py-4 ${currentLang === "ar" ? "text-right" : "text-left"}`}
                  >
                    {currentLang === "ar" ? "العميل" : "User"}
                  </th>
                  <th
                    className={`px-6 py-4 ${currentLang === "ar" ? "text-right" : "text-left"}`}
                  >
                    {currentLang === "ar" ? "الإجمالي" : "Total"}
                  </th>
                  <th
                    className={`px-6 py-4 ${currentLang === "ar" ? "text-right" : "text-left"}`}
                  >
                    {currentLang === "ar" ? "طريقة الدفع" : "Payment"}
                  </th>
                  <th
                    className={`px-6 py-4 ${currentLang === "ar" ? "text-right" : "text-left"}`}
                  >
                    {currentLang === "ar" ? "الحالة" : "Status"}
                  </th>
                  <th
                    className={`px-6 py-4 ${currentLang === "ar" ? "text-right" : "text-left"}`}
                  >
                    {currentLang === "ar" ? "التاريخ" : "Date"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-white text-xs">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* <div className="font-bold text-white">
                        {getUserDisplayName(order.fullName)}
                      </div> */}
                      <div className="text-gray-400 text-xs mt-0.5">
                        {order.fullName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-gray-200">
                      ${order.total?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400 font-medium">
                      {order.paymentMethod || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative inline-block">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(
                              order._id,
                              e.target.value as OrderStatus,
                            )
                          }
                          className={`px-3 py-1.5 text-xs font-bold rounded-full cursor-pointer appearance-none focus:outline-none transition-all ${statusConfig[order.status].color}`}
                        >
                          {statusOptions.map((status) => (
                            <option
                              key={status}
                              value={status}
                              className="bg-[#0b3b24] text-white"
                            >
                              {currentLang === "ar"
                                ? statusConfig[status].arLabel
                                : statusConfig[status].label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400 font-medium">
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
