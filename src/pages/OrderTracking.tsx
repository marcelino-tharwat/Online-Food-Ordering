import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  Loader2,
  Package,
  MapPin,
  Calendar,
  User,
  ChevronLeft,
  CheckCircle,
  Circle,
  Clock,
  XCircle,
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

interface OrderResponse {
  success: boolean;
  data: Order;
}

const STATUS_STEPS: { key: OrderStatus; label: { en: string; ar: string } }[] =
  [
    { key: "pending", label: { en: "Pending", ar: "قيد الانتظار" } },
    { key: "confirmed", label: { en: "Confirmed", ar: "تم التأكيد" } },
    { key: "delivered", label: { en: "Delivered", ar: "تم التوصيل" } },
    { key: "cancelled", label: { en: "Cancelled", ar: "ملغي" } },
  ];

function OrderTracking() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const currentLang = (i18n.language as "en" | "ar") || "en";

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        setError(t("orderTracking.invalidOrder"));
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError("");
      try {
        const response = await api.get<OrderResponse>(`/orders/${id}`);
        setOrder(response.data.data);
      } catch {
        setError(t("orderTracking.errorLoadingOrder"));
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id, currentLang, t]);

  const getLocalizedText = (obj: LocalizedText | undefined): string => {
    if (!obj) return "";
    return currentLang === "ar" ? obj.ar : obj.en;
  };

  const getStatusIndex = (status: OrderStatus): number => {
    return STATUS_STEPS.findIndex((step) => step.key === status);
  };

  const isCancelledStatus = (status: OrderStatus): boolean => {
    return status === "cancelled";
  };

  const getStepStatus = (
    stepKey: OrderStatus,
    currentStatus: OrderStatus,
  ): "completed" | "active" | "pending" | "cancelled" => {
    if (isCancelledStatus(currentStatus)) {
      if (stepKey === "cancelled") return "cancelled";
      if (stepKey === currentStatus) return "cancelled";
      if (getStatusIndex(stepKey) < getStatusIndex("pending")) return "completed";
      return "pending";
    }
    const stepIndex = getStatusIndex(stepKey);
    const currentIndex = getStatusIndex(currentStatus);
    if (stepKey === "cancelled") return "pending";
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "pending";
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString || "");
    return date.toLocaleDateString(currentLang === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number | undefined): string => {
    return `$${price?.toFixed(2) ?? "0.00"}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-brand-orange animate-spin" />
          <p className="text-text-secondary text-sm font-medium animate-pulse-soft">
            {t("orderTracking.loadingOrder")}
          </p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-error-bg border border-error-border flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-error" />
          </div>
          <h2 className="text-xl font-black mb-3 font-serif">
            {t("orderTracking.errorLoadingOrder")}
          </h2>
          <p className="text-text-secondary text-sm mb-8">
            {error || t("orderTracking.invalidOrder")}
          </p>
          <button
            onClick={() => navigate("/orders")}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border-medium text-text-secondary rounded-xl font-bold hover:text-text-primary hover:border-border-strong transition-all text-sm"
          >
            <ChevronLeft className={`w-4 h-4 ${currentLang === "ar" ? "rotate-180" : ""}`} />
            {t("orderTracking.backToOrders")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/orders")}
            className="p-2 rounded-xl border border-border-medium hover:bg-white/5 hover:border-border-strong transition-all"
          >
            <ChevronLeft className={`w-5 h-5 text-text-secondary ${currentLang === "ar" ? "rotate-180" : ""}`} />
          </button>
          <h1 className="text-xl md:text-2xl font-black font-serif tracking-tight">
            {t("orderTracking.orderTracking")}
          </h1>
        </div>

        <div className="bg-surface-card border border-border-light rounded-2xl p-6 md:p-8 mb-6 shadow-lg">
          <h2 className="text-sm font-bold text-text-secondary mb-8 tracking-wide">
            {t("orderTracking.orderJourney")}
          </h2>
          <div className="relative">
            <div className="hidden md:flex items-center justify-between">
              {STATUS_STEPS.map((step, index) => {
                const status = getStepStatus(step.key, order.status);
                const isLast = index === STATUS_STEPS.length - 1;
                return (
                  <div key={step.key} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className="transition-all duration-300">
                        {status === "completed" ? (
                          <div className="w-10 h-10 rounded-full bg-success/10 border border-success/20 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-success" />
                          </div>
                        ) : status === "active" ? (
                          <div className="w-10 h-10 rounded-full bg-info/10 border border-info/20 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-info animate-pulse" />
                          </div>
                        ) : status === "cancelled" ? (
                          <div className="w-10 h-10 rounded-full bg-error/10 border border-error/20 flex items-center justify-center">
                            <XCircle className="w-5 h-5 text-error" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-border-light flex items-center justify-center">
                            <Circle className="w-5 h-5 text-text-tertiary/40" />
                          </div>
                        )}
                      </div>
                      <span
                        className={`mt-3 text-xs font-bold tracking-wide transition-all ${
                          status === "completed"
                            ? "text-success"
                            : status === "active"
                              ? "text-info"
                              : status === "cancelled"
                                ? "text-error"
                                : "text-text-tertiary/50"
                        }`}
                      >
                        {getLocalizedText(step.label)}
                      </span>
                    </div>
                    {!isLast && (
                      <div
                        className={`flex-1 h-[2px] mx-4 rounded-full transition-colors ${
                          status === "completed"
                            ? "bg-success/40"
                            : "bg-border-light"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="md:hidden space-y-5">
              {STATUS_STEPS.map((step, index) => {
                const status = getStepStatus(step.key, order.status);
                const isLast = index === STATUS_STEPS.length - 1;
                return (
                  <div key={step.key} className="flex items-start gap-4">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="transition-all duration-300">
                        {status === "completed" ? (
                          <div className="w-8 h-8 rounded-full bg-success/10 border border-success/20 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-success" />
                          </div>
                        ) : status === "active" ? (
                          <div className="w-8 h-8 rounded-full bg-info/10 border border-info/20 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-info" />
                          </div>
                        ) : status === "cancelled" ? (
                          <div className="w-8 h-8 rounded-full bg-error/10 border border-error/20 flex items-center justify-center">
                            <XCircle className="w-4 h-4 text-error" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-white/[0.03] border border-border-light flex items-center justify-center">
                            <Circle className="w-4 h-4 text-text-tertiary/40" />
                          </div>
                        )}
                      </div>
                      {!isLast && (
                        <div
                          className={`w-[2px] h-8 my-1 transition-colors ${
                            status === "completed" ? "bg-success/30" : "bg-border-light"
                          }`}
                        />
                      )}
                    </div>
                    <div className="pt-1.5">
                      <span
                        className={`text-sm font-bold tracking-wide ${
                          status === "completed"
                            ? "text-success"
                            : status === "active"
                              ? "text-info"
                              : status === "cancelled"
                                ? "text-error"
                                : "text-text-tertiary/50"
                        }`}
                      >
                        {getLocalizedText(step.label)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-6 items-start">
          <div className="md:col-span-2 space-y-4">
            <div className="bg-surface-card border border-border-light rounded-2xl p-5 shadow-sm">
              <h2 className="text-sm font-bold text-text-secondary flex items-center gap-2 pb-3 border-b border-border-light mb-3">
                <Package className="w-4 h-4 text-brand-orange" />
                {t("orderTracking.orderSummary")}
              </h2>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-tertiary">{t("orderTracking.orderId")}</span>
                  <span className="font-mono text-text-primary font-bold tracking-wider">
                    #{order._id?.slice(-8).toUpperCase() || "--------"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">{t("orderTracking.orderDate")}</span>
                  <span className="text-text-primary">{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">{t("orderTracking.payment")}</span>
                  <span className="text-text-primary">{t("checkout.cashOnDelivery")}</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-card border border-border-light rounded-2xl p-5 shadow-sm">
              <h2 className="text-sm font-bold text-text-secondary flex items-center gap-2 pb-3 border-b border-border-light mb-3">
                <User className="w-4 h-4 text-brand-orange" />
                {t("orderTracking.recipientInfo")}
              </h2>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-tertiary">{t("orderTracking.fullName")}</span>
                  <span className="text-text-primary font-medium">{order.fullName || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">{t("orderTracking.phone")}</span>
                  <span className="text-text-primary font-mono">{order.phoneNumber || "-"}</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-card border border-border-light rounded-2xl p-5 shadow-sm">
              <h2 className="text-sm font-bold text-text-secondary flex items-center gap-2 pb-3 border-b border-border-light mb-3">
                <MapPin className="w-4 h-4 text-brand-orange" />
                {t("orderTracking.deliveryAddress")}
              </h2>
              <p className="text-xs text-text-secondary leading-relaxed">
                {order.address || "-"}
              </p>
            </div>
          </div>

          <div className="md:col-span-3 bg-surface-card border border-border-light rounded-2xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-text-secondary flex items-center gap-2 pb-4 border-b border-border-light mb-1">
              <Package className="w-4 h-4 text-brand-orange" />
              {t("orderTracking.itemsOrdered")}
            </h2>
            <div className="divide-y divide-border-light">
              {order.items?.map((item, index) => (
                <div
                  key={`${item.product?._id || "prod"}-${index}`}
                  className="py-3 flex gap-3 items-center"
                >
                  <img
                    src={item.product?.image || "/placeholder.png"}
                    alt={getLocalizedText(item.product?.name)}
                    className="w-12 h-12 object-cover rounded-xl bg-surface-overlay border border-border-light flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <h3 className="text-sm font-bold text-text-primary truncate">
                      {getLocalizedText(item.product?.name)}
                    </h3>
                    <p className="text-xs text-text-tertiary">
                      {t("orderTracking.qty")}{" "}
                      <span className="font-mono text-text-primary">{item.quantity || 0}</span>
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-bold font-mono text-text-primary">
                      {formatPrice(
                        (item.price || item.product?.price || 0) * (item.quantity || 0),
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border-light pt-4 flex justify-between items-center">
              <span className="text-sm font-bold text-text-secondary">
                {t("orderTracking.grandTotal")}
              </span>
              <span className="text-lg md:text-xl font-black font-mono text-brand-orange">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderTracking;
