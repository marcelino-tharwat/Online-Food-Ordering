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
  Clock,
  AlertCircle,
} from "lucide-react";

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

const STATUS_CONFIG: Record<
  OrderStatus,
  { dot: string; bg: string; label: { en: string; ar: string } }
> = {
  pending: {
    dot: "bg-warning",
    bg: "bg-warning/10 border border-warning/20",
    label: { en: "Pending", ar: "قيد الانتظار" },
  },
  confirmed: {
    dot: "bg-info",
    bg: "bg-info/10 border border-info/20",
    label: { en: "Confirmed", ar: "تم التأكيد" },
  },
  delivered: {
    dot: "bg-success",
    bg: "bg-success/10 border border-success/20",
    label: { en: "Delivered", ar: "تم التوصيل" },
  },
  cancelled: {
    dot: "bg-error",
    bg: "bg-error/10 border border-error/20",
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

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-brand-orange animate-spin" />
          <p className="text-text-secondary text-sm font-medium animate-pulse-soft">
            {t("orders.loadingOrders")}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-error-bg border border-error-border flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-error" />
          </div>
          <h2 className="text-xl font-black mb-3 font-serif">{t("orders.orderError")}</h2>
          <p className="text-text-secondary text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-brand-orange" />
          </div>
          <h2 className="text-2xl font-black mb-3 font-serif tracking-tight">
            {t("orders.noOrders")}
          </h2>
          <p className="text-text-secondary text-sm mb-8">
            {t("orders.emptyMessage")}
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="px-8 py-3.5 bg-gradient-orange text-white rounded-xl font-bold shadow-md shadow-orange-900/30 hover:shadow-lg transition-all"
          >
            {t("checkout.browseMenu")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-black font-serif tracking-tight mb-8">
          {t("orders.myOrders")}
        </h1>

        <div className="space-y-4">
          {orders.map((order) => {
            const statusCfg = STATUS_CONFIG[order.status];
            const itemCount =
              order.items?.reduce(
                (sum: number, item) => sum + (item.quantity || 0),
                0,
              ) || 0;

            return (
              <div
                key={order._id}
                className="bg-surface-card border border-border-light rounded-2xl p-5 hover:border-border-medium transition-all animate-fade-in shadow-sm hover:shadow-md"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-sm font-bold tracking-wider text-text-primary">
                        #{order._id?.slice(-8).toUpperCase() || "--------"}
                      </span>
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${statusCfg.bg}`}>
                        <span className={`inline-block w-1.5 h-1.5 rounded-full ${statusCfg.dot} me-1.5 align-middle`} />
                        {getLocalizedText(statusCfg.label)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-text-secondary">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3 h-3 text-brand-orange" />
                        {order.fullName || "-"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-brand-orange" />
                        {order.phoneNumber || "-"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-brand-orange" />
                        {formatDate(order.createdAt || "")}
                      </span>
                    </div>

                    {order.address && (
                      <div className="flex items-start gap-1.5 text-xs text-text-tertiary">
                        <MapPin className="w-3 h-3 text-brand-orange mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">{order.address}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 pt-2 border-t border-border-light text-xs">
                      <div>
                        <span className="text-text-tertiary block">{t("common.total")}</span>
                        <span className="text-base font-black font-mono text-brand-orange">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                      <div>
                        <span className="text-text-tertiary block">{t("orders.items")}</span>
                        <span className="font-bold text-text-primary">
                          {itemCount} {t("orders.product")}
                        </span>
                      </div>
                      <div>
                        <span className="text-text-tertiary block">{t("common.payment")}</span>
                        <span className="font-medium text-text-secondary">
                          {t("checkout.cashOnDelivery")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 lg:ps-4 lg:border-s lg:border-border-light">
                    <button
                      onClick={() => navigate(`/orders/${order._id}`)}
                      className="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-border-medium text-text-secondary rounded-xl text-xs font-bold hover:text-text-primary hover:border-border-strong hover:bg-white/5 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
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
