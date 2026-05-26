import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  Loader2,
  Package,
  MapPin,
  Calendar,
  ExternalLink,
  ShoppingBag,
  Phone,
  User,
} from "lucide-react";

// Types
interface LocalizedText {
  en: string;
  ar: string;
}

interface Product {
  _id: string;
  name: LocalizedText;
  price: number;
  image?: string;
}

interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

type OrderStatus = "pending" | "confirmed" | "delivered" | "cancelled";

interface Order {
  _id: string;
  status: OrderStatus;
  fullName: string;
  phoneNumber: string;
  address: string;
  paymentMethod: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

interface OrdersResponse {
  success: boolean;
  count: number;
  data: Order[];
}

// Status badge colors
const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string; label: { en: string; ar: string } }> = {
  pending: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    label: { en: "Pending", ar: "قيد الانتظار" },
  },
  confirmed: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    label: { en: "Confirmed", ar: "تم التأكيد" },
  },
  delivered: {
    bg: "bg-green-100",
    text: "text-green-800",
    label: { en: "Delivered", ar: "تم التوصيل" },
  },
  cancelled: {
    bg: "bg-red-100",
    text: "text-red-800",
    label: { en: "Cancelled", ar: "ملغي" },
  },
};

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const currentLang = localStorage.getItem("lang") || "en";

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await api.get<OrdersResponse>("/orders/my");
        const sortedOrders = (response.data.data || []).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sortedOrders);
      } catch {
        setError(currentLang === "ar" ? "فشل تحميل الطلبات" : "Failed to load orders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [currentLang]);

  const getLocalizedText = (obj: LocalizedText | undefined): string => {
    if (!obj) return "";
    return currentLang === "ar" ? obj.ar : obj.en;
  };

  const getStatusColor = (status: OrderStatus) => {
    return STATUS_COLORS[status] || STATUS_COLORS.pending;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLang === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price: number): string => {
    return `$${price?.toFixed(2) ?? "0.00"}`;
  };

  const handleTrackOrder = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-gray-600">
            {currentLang === "ar" ? "جاري تحميل الطلبات..." : "Loading orders..."}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <Package className="w-20 h-20 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {currentLang === "ar" ? "خطأ في تحميل الطلبات" : "Error Loading Orders"}
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <ShoppingBag className="w-20 h-20 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {currentLang === "ar" ? "لا توجد طلبات" : "No Orders Yet"}
          </h2>
          <p className="text-gray-600 mb-6">
            {currentLang === "ar"
              ? "لم تقم بأي طلبات حتى الآن"
              : "You haven't placed any orders yet"}
          </p>
          <a
            href="/menu"
            className="inline-block w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {currentLang === "ar" ? "تصفح القائمة" : "Browse Menu"}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
          {currentLang === "ar" ? "طلباتي" : "My Orders"}
        </h1>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => {
            const statusColor = getStatusColor(order.status);
            const itemCount = order.items?.reduce((sum: number, item) => sum + (item.quantity || 0), 0) || 0;

            return (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {/* Left side - Order info */}
                  <div className="flex-1">
                    {/* Header row */}
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="font-mono text-lg font-semibold text-gray-800">
                        #{order._id?.slice(-8).toUpperCase() || "--------"}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor.bg} ${statusColor.text}`}
                      >
                        {getLocalizedText(statusColor.label)}
                      </span>
                    </div>

                    {/* Customer Info */}
                    <div className="flex flex-wrap items-center gap-4 mb-3 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-800">{order.fullName || "-"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{order.phoneNumber || "-"}</span>
                      </div>
                    </div>

                    {/* Details grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                      {/* Total */}
                      <div>
                        <span className="text-gray-500">
                          {currentLang === "ar" ? "المجموع" : "Total"}
                        </span>
                        <p className="font-semibold text-gray-800">
                          {formatPrice(order.total)}
                        </p>
                      </div>

                      {/* Payment method */}
                      <div>
                        <span className="text-gray-500">
                          {currentLang === "ar" ? "طريقة الدفع" : "Payment"}
                        </span>
                        <p className="font-medium text-gray-800">
                          {currentLang === "ar" ? "الدفع عند الاستلام" : "Cash on Delivery"}
                        </p>
                      </div>

                      {/* Items count */}
                      <div>
                        <span className="text-gray-500">
                          {currentLang === "ar" ? "المنتجات" : "Items"}
                        </span>
                        <p className="font-medium text-gray-800">
                          {itemCount} {currentLang === "ar" ? "منتج" : "item(s)"}
                        </p>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{formatDate(order.createdAt || "")}</span>
                      </div>

                      {/* Address */}
                      <div className="flex items-start gap-2 sm:col-span-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <span className="text-gray-600">{order.address || "-"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Track button */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleTrackOrder(order._id)}
                      className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {currentLang === "ar" ? "تتبع الطلب" : "Track Order"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Orders;