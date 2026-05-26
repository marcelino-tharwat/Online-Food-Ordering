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

interface OrderResponse {
  success: boolean;
  data: Order;
}

// Status stepper configuration
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
      if (stepKey === "pending") return "completed";
      return "pending";
    }

    const stepIndex = STATUS_STEPS.findIndex((s) => s.key === stepKey);
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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[80vh] bg-[#0b3b24] flex items-center justify-center text-white font-sans">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#ea580c] animate-spin" />
          <p className="text-gray-300 font-medium">
            {t("orderTracking.loadingOrder")}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className="min-h-[80vh] bg-[#0b3b24] flex items-center justify-center px-4 text-white font-sans">
        <div className="max-w-md w-full text-center py-12">
          <div className="flex justify-center mb-6">
            <Package className="w-16 h-16 text-[#ea580c]" />
          </div>
          <h2 className="text-2xl font-black mb-3 font-serif">
            {t("orderTracking.errorLoadingOrder")}
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            {error || t("orderTracking.invalidOrder")}
          </p>
          <button
            onClick={() => navigate("/orders")}
            className="w-full flex items-center justify-center gap-2 border border-white/20 text-white py-3.5 rounded-full font-bold hover:bg-white/5 transition-all"
          >
            <ChevronLeft
              className={`w-4 h-4 ${currentLang === "ar" ? "rotate-180" : ""}`}
            />
            {t("orderTracking.backToOrders")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b3b24] py-12 text-white font-sans">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={() => navigate("/orders")}
            className="p-2.5 rounded-full border border-white/10 hover:bg-white/5 transition-colors"
          >
            <ChevronLeft
              className={`w-5 h-5 text-gray-200 ${currentLang === "ar" ? "rotate-180" : ""}`}
            />
          </button>
          <h1 className="text-2xl md:text-3xl font-black font-serif tracking-wide">
            {t("orderTracking.orderTracking")}
          </h1>
        </div>

        {/* Order Status Stepper */}
        <div className="border border-white/10 p-6 rounded-2xl bg-[#0b3b24] mb-8">
          <h2 className="text-base font-bold text-gray-300 mb-8 tracking-wide">
            {t("orderTracking.orderJourney")}
          </h2>
          <div className="relative">
            {/* Desktop Stepper */}
            <div className="hidden md:flex items-center justify-between">
              {STATUS_STEPS.map((step, index) => {
                const status = getStepStatus(step.key, order.status);
                const isLast = index === STATUS_STEPS.length - 1;

                return (
                  <div key={step.key} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      {/* Step Icon */}
                      <div className="transition-colors">
                        {status === "completed" ? (
                          <CheckCircle className="w-8 h-8 text-emerald-400" />
                        ) : status === "active" ? (
                          <Clock className="w-8 h-8 text-sky-400 animate-pulse" />
                        ) : status === "cancelled" ? (
                          <XCircle className="w-8 h-8 text-rose-400" />
                        ) : (
                          <Circle className="w-8 h-8 text-white/20" />
                        )}
                      </div>
                      {/* Step Label */}
                      <span
                        className={`mt-3 text-xs font-bold tracking-wide transition-colors ${
                          status === "completed"
                            ? "text-emerald-400"
                            : status === "active"
                              ? "text-sky-400 font-black"
                              : status === "cancelled"
                                ? "text-rose-400"
                                : "text-gray-500"
                        }`}
                      >
                        {getLocalizedText(step.label)}
                      </span>
                    </div>
                    {/* Connector Line */}
                    {!isLast && (
                      <div
                        className={`flex-1 h-[2px] mx-4 rounded-full transition-colors ${
                          status === "completed"
                            ? "bg-emerald-500/50"
                            : "bg-white/10"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile Stepper (Vertical) */}
            <div className="md:hidden space-y-5">
              {STATUS_STEPS.map((step, index) => {
                const status = getStepStatus(step.key, order.status);
                const isLast = index === STATUS_STEPS.length - 1;

                return (
                  <div key={step.key} className="flex items-start gap-4">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div>
                        {status === "completed" ? (
                          <CheckCircle className="w-6 h-6 text-emerald-400" />
                        ) : status === "active" ? (
                          <Clock className="w-6 h-6 text-sky-400" />
                        ) : status === "cancelled" ? (
                          <XCircle className="w-6 h-6 text-rose-400" />
                        ) : (
                          <Circle className="w-6 h-6 text-white/20" />
                        )}
                      </div>
                      {!isLast && (
                        <div
                          className={`w-[2px] h-8 my-1 transition-colors ${
                            status === "completed"
                              ? "bg-emerald-500/40"
                              : "bg-white/10"
                          }`}
                        />
                      )}
                    </div>
                    <div className="pt-0.5">
                      <span
                        className={`text-sm font-bold tracking-wide ${
                          status === "completed"
                            ? "text-emerald-400"
                            : status === "active"
                              ? "text-sky-400 font-black"
                              : status === "cancelled"
                                ? "text-rose-400"
                                : "text-gray-500"
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

        {/* Order Details & Items Layout Grid */}
        <div className="grid md:grid-cols-5 gap-6 items-start">
          {/* Left / Top Columns - Order Metadata */}
          <div className="md:col-span-2 space-y-6">
            {/* Summary Block */}
            <div className="border border-white/10 p-5 rounded-2xl bg-[#0b3b24] space-y-4 text-xs">
              <h2 className="text-sm font-bold text-gray-300 flex items-center gap-2 pb-2 border-b border-white/5">
                <Package className="w-4 h-4 text-[#ea580c]" />
                {t("orderTracking.orderSummary")}
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">
                    {t("orderTracking.orderId")}
                  </span>
                  <span className="font-mono text-gray-200 tracking-wider">
                    #{order._id?.slice(-8).toUpperCase() || "--------"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">
                    {t("orderTracking.orderDate")}
                  </span>
                  <span className="text-gray-200">
                    {formatDate(order.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">
                    {t("orderTracking.payment")}
                  </span>
                  <span className="text-gray-200">
                    {t("checkout.cashOnDelivery")}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Info Block */}
            <div className="border border-white/10 p-5 rounded-2xl bg-[#0b3b24] space-y-4 text-xs">
              <h2 className="text-sm font-bold text-gray-300 flex items-center gap-2 pb-2 border-b border-white/5">
                <User className="w-4 h-4 text-[#ea580c]" />
                {t("orderTracking.recipientInfo")}
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">
                    {t("orderTracking.fullName")}
                  </span>
                  <span className="text-gray-200 font-medium">
                    {order.fullName || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">
                    {t("orderTracking.phone")}
                  </span>
                  <span className="text-gray-200 font-mono">
                    {order.phoneNumber || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Address Block */}
            <div className="border border-white/10 p-5 rounded-2xl bg-[#0b3b24] space-y-3 text-xs">
              <h2 className="text-sm font-bold text-gray-300 flex items-center gap-2 pb-1">
                <MapPin className="w-4 h-4 text-[#ea580c]" />
                {t("orderTracking.deliveryAddress")}
              </h2>
              <p className="text-gray-400 leading-relaxed font-light">
                {order.address || "-"}
              </p>
            </div>
          </div>

          {/* Right / Bottom Columns - Order Items Basket */}
          <div className="md:col-span-3 border border-white/10 p-6 rounded-2xl bg-[#0b3b24]">
            <h2 className="text-sm font-bold text-gray-300 flex items-center gap-2 pb-4 border-b border-white/5">
              <Package className="w-4 h-4 text-[#ea580c]" />
              {t("orderTracking.itemsOrdered")}
            </h2>
            <div className="divide-y divide-white/5">
              {order.items?.map((item, index) => (
                <div
                  key={`${item.product?._id || "prod"}-${index}`}
                  className="py-4 flex gap-4 items-center"
                >
                  <img
                    src={item.product?.image || "/placeholder.png"}
                    alt={getLocalizedText(item.product?.name)}
                    className="w-14 h-14 object-cover rounded-xl bg-white/5 border border-white/5 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <h3 className="text-sm font-bold text-gray-200 truncate">
                      {getLocalizedText(item.product?.name)}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {t("orderTracking.qty")}
                      <span className="font-mono text-gray-200">
                        {item.quantity || 0}
                      </span>
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-bold font-mono text-gray-200">
                      {formatPrice(
                        (item.price || item.product?.price || 0) *
                          (item.quantity || 0),
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Section */}
            <div className="border-t border-white/5 mt-4 pt-4 flex justify-between items-center">
              <span className="text-sm font-bold text-gray-300">
                {t("orderTracking.grandTotal")}
              </span>
              <span className="text-lg font-black font-mono text-[#ea580c]">
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
