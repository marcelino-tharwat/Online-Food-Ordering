import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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

const STATUS_COLORS: Record<
  OrderStatus,
  { text: string; label: { en: string; ar: string } }
> = {
  pending: {
    text: "text-amber-400",
    label: { en: "Pending", ar: "قيد الانتظار" },
  },
  confirmed: {
    text: "text-sky-400",
    label: { en: "Confirmed", ar: "تم التأكيد" },
  },
  delivered: {
    text: "text-emerald-400",
    label: { en: "Delivered", ar: "تم التوصيل" },
  },
  cancelled: {
    text: "text-rose-400",
    label: { en: "Cancelled", ar: "ملغي" },
  },
};

function Orders() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const currentLang = (i18n.language as "en" | "ar") || "en";

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await api.get<OrdersResponse>("/orders/my");
        const sortedOrders = (response.data.data || []).sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setOrders(sortedOrders);
      } catch {
        setError(t("orders.orderError"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [currentLang, t]);

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
      <div className="min-h-[80vh] bg-[#0b3b24] flex items-center justify-center text-white font-sans">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#ea580c] animate-spin" />
          <p className="text-gray-300 font-medium">
            {t("orders.loadingOrders")}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-[80vh] bg-[#0b3b24] flex items-center justify-center px-4 text-white font-sans">
        <div className="max-w-md w-full text-center py-12">
          <div className="flex justify-center mb-6">
            <Package className="w-16 h-16 text-[#ea580c]" />
          </div>
          <h2 className="text-2xl font-black mb-3 font-serif">
            {t("orders.orderError")}
          </h2>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (orders.length === 0) {
    return (
      <div className="min-h-[80vh] bg-[#0b3b24] flex items-center justify-center px-4 text-white font-sans">
        <div className="max-w-md w-full text-center py-12">
          <div className="flex justify-center mb-6">
            <ShoppingBag className="w-16 h-16 text-[#ea580c] opacity-90" />
          </div>
          <h2 className="text-2xl font-black mb-3 font-serif">
            {t("orders.noOrders")}
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            {t("orders.emptyMessage")}
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="w-full bg-[#ea580c] text-white py-3.5 rounded-full font-bold shadow-sm hover:bg-[#d94e06] transition-all"
          >
            {t("checkout.browseMenu")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b3b24] py-12 text-white font-sans">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-black mb-10 font-serif tracking-wide">
          {t("orders.myOrders")}
        </h1>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => {
            const statusColor = getStatusColor(order.status);
            const itemCount =
              order.items?.reduce(
                (sum: number, item) => sum + (item.quantity || 0),
                0,
              ) || 0;

            return (
              <div
                key={order._id}
                className="border border-white/10 p-6 rounded-2xl bg-[#0b3b24] transition-all hover:border-white/20"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  {/* Info Block */}
                  <div className="flex-1 space-y-4">
                    {/* Header: ID & Status */}
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-base font-bold tracking-wider text-gray-200">
                        #{order._id?.slice(-8).toUpperCase() || "--------"}
                      </span>
                      <span className="text-white/20">|</span>
                      <span className={`text-sm font-bold ${statusColor.text}`}>
                        • {getLocalizedText(statusColor.label)}
                      </span>
                    </div>

                    {/* Customer Core Info */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-300">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-[#ea580c]" />
                        <span className="font-medium">
                          {order.fullName || "-"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-[#ea580c]" />
                        <span className="font-mono">
                          {order.phoneNumber || "-"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#ea580c]" />
                        <span>{formatDate(order.createdAt || "")}</span>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 pt-2 border-t border-white/5 text-xs">
                      <div>
                        <span className="text-gray-400 block mb-1">
                          {t("common.total")}
                        </span>
                        <p className="text-base font-black font-mono text-[#ea580c]">
                          {formatPrice(order.total)}
                        </p>
                      </div>

                      <div>
                        <span className="text-gray-400 block mb-1">
                          {t("common.payment")}
                        </span>
                        <p className="font-bold text-gray-200">
                          {t("checkout.cashOnDelivery")}
                        </p>
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <span className="text-gray-400 block mb-1">
                          {t("orders.items")}
                        </span>
                        <p className="font-bold text-gray-200">
                          {itemCount} {t("orders.product")}
                        </p>
                      </div>
                    </div>

                    {/* Full Address field */}
                    <div className="flex items-start gap-2 pt-2 text-xs text-gray-400">
                      <MapPin className="w-3.5 h-3.5 text-[#ea580c] mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">
                        {order.address || "-"}
                      </span>
                    </div>
                  </div>

                  {/* Action Button: Track Order */}
                  <div className="flex-shrink-0 lg:pt-0 pt-2 border-t border-white/5 lg:border-none">
                    <button
                      onClick={() => handleTrackOrder(order._id)}
                      className="w-full lg:w-auto flex items-center justify-center gap-2 px-6 py-3 border border-white/20 text-white rounded-full text-sm font-bold hover:bg-white/5 hover:border-white/40 transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {t("orders.trackOrder")}
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
