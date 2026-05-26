import { useEffect, useState } from "react";
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
const STATUS_STEPS: { key: OrderStatus; label: { en: string; ar: string } }[] = [
  { key: "pending", label: { en: "Pending", ar: "قيد الانتظار" } },
  { key: "confirmed", label: { en: "Confirmed", ar: "تم التأكيد" } },
  { key: "delivered", label: { en: "Delivered", ar: "تم التوصيل" } },
  { key: "cancelled", label: { en: "Cancelled", ar: "ملغي" } },
];

function OrderTracking() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const currentLang = localStorage.getItem("lang") || "en";

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        setError("Order ID not found");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const response = await api.get<OrderResponse>(`/orders/${id}`);
        setOrder(response.data.data);
      } catch {
        setError(currentLang === "ar" ? "فشل تحميل الطلب" : "Failed to load order");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id, currentLang]);

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
    currentStatus: OrderStatus
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
      month: "long",
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-gray-600">
            {currentLang === "ar" ? "جاري تحميل الطلب..." : "Loading order..."}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <Package className="w-20 h-20 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {currentLang === "ar" ? "خطأ في تحميل الطلب" : "Error Loading Order"}
          </h2>
          <p className="text-gray-600 mb-6">{error || "Order not found"}</p>
          <button
            onClick={() => navigate("/orders")}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            {currentLang === "ar" ? "العودة للطلبات" : "Back to Orders"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/orders")}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {currentLang === "ar" ? "تتبع الطلب" : "Order Tracking"}
          </h1>
        </div>

        {/* Order Status Stepper */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            {currentLang === "ar" ? "حالة الطلب" : "Order Status"}
          </h2>
          <div className="relative">
            {/* Stepper Container */}
            <div className="hidden md:flex items-center justify-between">
              {STATUS_STEPS.map((step, index) => {
                const status = getStepStatus(step.key, order.status);
                const isLast = index === STATUS_STEPS.length - 1;

                return (
                  <div key={step.key} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      {/* Step Circle */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                          status === "completed"
                            ? "bg-green-500 border-green-500"
                            : status === "active"
                              ? "bg-blue-600 border-blue-600"
                              : status === "cancelled"
                                ? "bg-red-500 border-red-500"
                                : "bg-gray-100 border-gray-300"
                        }`}
                      >
                        {status === "completed" ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : status === "active" ? (
                          <Clock className="w-6 h-6 text-white" />
                        ) : status === "cancelled" ? (
                          <XCircle className="w-6 h-6 text-white" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      {/* Step Label */}
                      <span
                        className={`mt-2 text-sm font-medium text-center ${
                          status === "completed"
                            ? "text-green-600"
                            : status === "active"
                              ? "text-blue-600"
                              : status === "cancelled"
                                ? "text-red-600"
                                : "text-gray-400"
                        }`}
                      >
                        {getLocalizedText(step.label)}
                      </span>
                    </div>
                    {/* Connector Line */}
                    {!isLast && (
                      <div
                        className={`flex-1 h-1 mx-2 rounded ${
                          status === "completed" ? "bg-green-500" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile Stepper (Vertical) */}
            <div className="md:hidden space-y-4">
              {STATUS_STEPS.map((step, index) => {
                const status = getStepStatus(step.key, order.status);
                const isLast = index === STATUS_STEPS.length - 1;

                return (
                  <div key={step.key} className="flex items-start gap-4">
                    {/* Step Circle */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                          status === "completed"
                            ? "bg-green-500 border-green-500"
                            : status === "active"
                              ? "bg-blue-600 border-blue-600"
                              : status === "cancelled"
                                ? "bg-red-500 border-red-500"
                                : "bg-gray-100 border-gray-300"
                        }`}
                      >
                        {status === "completed" ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : status === "active" ? (
                          <Clock className="w-5 h-5 text-white" />
                        ) : status === "cancelled" ? (
                          <XCircle className="w-5 h-5 text-white" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      {/* Connector Line */}
                      {!isLast && (
                        <div
                          className={`w-0.5 h-8 my-1 ${
                            status === "completed" ? "bg-green-500" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                    {/* Step Label */}
                    <div className="pt-1">
                      <span
                        className={`font-medium ${
                          status === "completed"
                            ? "text-green-600"
                            : status === "active"
                              ? "text-blue-600"
                              : status === "cancelled"
                                ? "text-red-600"
                                : "text-gray-400"
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

        {/* Order Details & Items */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - Order Details */}
          <div className="space-y-6">
            {/* Order Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                {currentLang === "ar" ? "معلومات الطلب" : "Order Details"}
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {currentLang === "ar" ? "رقم الطلب" : "Order ID"}
                  </span>
                  <span className="font-mono text-sm text-gray-800">
                    #{order._id?.slice(-8).toUpperCase() || "--------"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {currentLang === "ar" ? "تاريخ الطلب" : "Order Date"}
                  </span>
                  <span className="text-gray-800 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(order.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {currentLang === "ar" ? "طريقة الدفع" : "Payment Method"}
                  </span>
                  <span className="text-gray-800">
                    {currentLang === "ar" ? "الدفع عند الاستلام" : "Cash on Delivery"}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                {currentLang === "ar" ? "معلومات العميل" : "Customer Info"}
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    {currentLang === "ar" ? "الاسم" : "Name"}
                  </span>
                  <span className="text-gray-800 font-medium">
                    {order.fullName || "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    {currentLang === "ar" ? "الهاتف" : "Phone"}
                  </span>
                  <span className="text-gray-800">
                    {order.phoneNumber || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                {currentLang === "ar" ? "عنوان التوصيل" : "Delivery Address"}
              </h2>
              <p className="text-gray-800">{order.address || "-"}</p>
            </div>
          </div>

          {/* Right Column - Order Items */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              {currentLang === "ar" ? "المنتجات" : "Items"}
            </h2>
            <div className="divide-y divide-gray-200">
              {order.items?.map((item, index) => (
                <div key={`${item.product?._id || "product"}-${index}`} className="py-4 flex gap-4">
                  <img
                    src={item.product?.image || "/placeholder.png"}
                    alt={getLocalizedText(item.product?.name)}
                    className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 truncate">
                      {getLocalizedText(item.product?.name)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {currentLang === "ar" ? "الكمية: " : "Qty: "}
                      {item.quantity || 0}
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {formatPrice((item.price || item.product?.price || 0) * (item.quantity || 0))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800">
                  {currentLang === "ar" ? "المجموع الكلي" : "Total"}
                </span>
                <span className="text-xl font-bold text-blue-600">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderTracking;