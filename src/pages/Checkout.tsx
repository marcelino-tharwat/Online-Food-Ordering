import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/axios";
import { z } from "zod";
import { cartService } from "../services/cartService";
import {
  setCartItems,
  clearCart,
  setLoading,
  setError,
  type CartItem,
  type LocalizedText,
} from "../redux/slices/cartSlice";
import type { RootState, AppDispatch } from "../redux/store";
import {
  Loader2,
  ShoppingBag,
  CreditCard,
  Banknote,
  MapPin,
  Phone,
  User,
  Building,
  FileText,
  CheckCircle,
} from "lucide-react";

type PaymentMethod = "COD";

interface AddressForm {
  fullName: string;
  phone: string;
  city: string;
  street: string;
  notes: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  city?: string;
  street?: string;
}

function Checkout() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language as "en" | "ar") || "en";
  const { cartItems, loading: cartLoading } = useSelector(
    (state: RootState) => state.cart,
  );

  const [address, setAddress] = useState<AddressForm>({
    fullName: "",
    phone: "",
    city: "",
    street: "",
    notes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0) {
      void fetchCart();
    }
  }, [cartItems.length, t]);

  const fetchCart = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const cartData = await cartService.getCart();
      dispatch(setCartItems(cartData));
    } catch {
      dispatch(setError(t("cart.loadCartError")));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getLocalizedText = (obj: LocalizedText | undefined): string => {
    if (!obj) return "";
    return currentLang === "ar" ? obj.ar : obj.en;
  };

  const computedTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  // const validateForm = (): boolean => {
  //   const errors: FormErrors = {};
  //   if (!address.fullName.trim()) {
  //     errors.fullName = t("checkout.fullNameRequired");
  //   }
  //   if (!address.phone.trim()) {
  //     errors.phone = t("checkout.phoneRequired");
  //   }
  //   if (!address.city.trim()) {
  //     errors.city = t("checkout.cityRequired");
  //   }
  //   if (!address.street.trim()) {
  //     errors.street = t("checkout.streetRequired");
  //   }
  //   setFormErrors(errors);
  //   return Object.keys(errors).length === 0;
  // };

  const checkoutSchema = z.object({
    fullName: z.string().min(3, "Full name is too short"),
    phone: z
      .string()
      .regex(/^01[0-2,5]{1}[0-9]{8}$/, "Invalid Egyptian phone number"),
    city: z.string().min(2, "City is required"),
    street: z.string().min(5, "Street is too short"),
    notes: z.string().optional(),
  });

  const validateForm = (): boolean => {
    const result = checkoutSchema.safeParse(address);

    if (!result.success) {
      const errors: FormErrors = {};

      (result.error as z.ZodError).issues.forEach((err) => {
        const field = err.path[0] as keyof FormErrors;
        errors[field] = err.message;
      });

      setFormErrors(errors);
      return false;
    }

    setFormErrors({});
    return true;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    if (cartItems.length === 0) {
      setSubmitError(t("checkout.emptyCart", "Your cart is empty"));
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const orderData = {
        fullName: address.fullName.trim(),
        phoneNumber: address.phone.trim(),
        address: `${address.city.trim()}, ${address.street.trim()}`,
      };

      await api.post("/orders", orderData);
      await cartService.clearCart();
      dispatch(clearCart());
      setSuccess(true);
    } catch (error) {
      if (error && typeof error === "object" && "response" in error) {
        const err = error as { response?: { data?: { message?: string } } };
        console.error("Backend error:", err.response?.data?.message);
      }
      setSubmitError(
        t(
          "checkout.placeOrderError",
          "Failed to place order. Please try again.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] bg-[#0b3b24] flex items-center justify-center px-4 text-white font-sans">
        <div className="max-w-md w-full text-center py-12">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-16 h-16 text-[#ea580c]" />
          </div>
          <h2 className="text-2xl font-black mb-3 font-serif">
            {t("checkout.orderPlaced")}
          </h2>
          <p className="text-gray-300 text-sm mb-8">
            {t("checkout.successMessage")}
          </p>
          <button
            onClick={() => navigate("/orders")}
            className="w-full bg-[#ea580c] text-white py-3.5 rounded-full font-bold shadow-sm hover:bg-[#d94e06] transition-all"
          >
            {t("checkout.viewOrders")}
          </button>
        </div>
      </div>
    );
  }

  if (cartLoading && cartItems.length === 0) {
    return (
      <div className="min-h-[80vh] bg-[#0b3b24] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#ea580c] animate-spin" />
          <p className="text-gray-300 font-medium">
            {t("checkout.loadingCheckout", "Loading checkout...")}
          </p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[80vh] bg-[#0b3b24] flex items-center justify-center px-4 text-white font-sans">
        <div className="max-w-md w-full text-center py-12">
          <div className="flex justify-center mb-6">
            <ShoppingBag className="w-16 h-16 text-[#ea580c] opacity-90" />
          </div>
          <h2 className="text-2xl font-black mb-3 font-serif">
            {t("checkout.emptyCart")}
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            {t("checkout.emptyMessage")}
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
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-black mb-10 font-serif tracking-wide">
          {t("checkout.checkout")}
        </h1>

        {submitError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl mb-8 text-sm text-center">
            {submitError}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left Column - Address & Payment */}
          <div className="space-y-10">
            {/* Address Form */}
            <div className="bg-[#0b3b24]">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-white/10 pb-3 font-serif">
                <MapPin className="w-5 h-5 text-[#ea580c]" />
                {t("checkout.deliveryAddress")}
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    {`${t("common.fullName")} *`}
                  </label>
                  <div className="relative">
                    <User
                      className={`absolute ${currentLang === "ar" ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-4 h-4 text-white/30`}
                    />
                    <input
                      type="text"
                      name="fullName"
                      value={address.fullName}
                      onChange={handleInputChange}
                      placeholder={t("checkout.namePlaceholder")}
                      className={`w-full ${currentLang === "ar" ? "pr-11 pl-4" : "pl-11 pr-4"} py-3 bg-[#0b3b24] text-white border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#ea580c] focus:border-[#ea580c] transition-all placeholder-white/20 ${
                        formErrors.fullName
                          ? "border-red-400"
                          : "border-white/20"
                      }`}
                    />
                  </div>
                  {formErrors.fullName && (
                    <p className="text-red-400 text-xs mt-1.5 font-medium">
                      ⚠️ {formErrors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    {`${t("common.phoneNumber")} *`}
                  </label>
                  <div className="relative">
                    <Phone
                      className={`absolute ${currentLang === "ar" ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-4 h-4 text-white/30`}
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={address.phone}
                      onChange={handleInputChange}
                      placeholder={t("checkout.phonePlaceholder")}
                      className={`w-full ${currentLang === "ar" ? "pr-11 pl-4" : "pl-11 pr-4"} py-3 bg-[#0b3b24] text-white border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#ea580c] focus:border-[#ea580c] transition-all placeholder-white/20 ${
                        formErrors.phone ? "border-red-400" : "border-white/20"
                      }`}
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="text-red-400 text-xs mt-1.5 font-medium">
                      ⚠️ {formErrors.phone}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                      {`${t("common.city")} *`}
                    </label>
                    <div className="relative">
                      <Building
                        className={`absolute ${currentLang === "ar" ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-4 h-4 text-white/30`}
                      />
                      <input
                        type="text"
                        name="city"
                        value={address.city}
                        onChange={handleInputChange}
                        placeholder={t("checkout.cityPlaceholder")}
                        className={`w-full ${currentLang === "ar" ? "pr-11 pl-4" : "pl-11 pr-4"} py-3 bg-[#0b3b24] text-white border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#ea580c] focus:border-[#ea580c] transition-all placeholder-white/20 ${
                          formErrors.city ? "border-red-400" : "border-white/20"
                        }`}
                      />
                    </div>
                    {formErrors.city && (
                      <p className="text-red-400 text-xs mt-1.5 font-medium">
                        ⚠️ {formErrors.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                      {`${t("common.street")} *`}
                    </label>
                    <div className="relative">
                      <MapPin
                        className={`absolute ${currentLang === "ar" ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 w-4 h-4 text-white/30`}
                      />
                      <input
                        type="text"
                        name="street"
                        value={address.street}
                        onChange={handleInputChange}
                        placeholder={t("checkout.streetPlaceholder")}
                        className={`w-full ${currentLang === "ar" ? "pr-11 pl-4" : "pl-11 pr-4"} py-3 bg-[#0b3b24] text-white border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#ea580c] focus:border-[#ea580c] transition-all placeholder-white/20 ${
                          formErrors.street
                            ? "border-red-400"
                            : "border-white/20"
                        }`}
                      />
                    </div>
                    {formErrors.street && (
                      <p className="text-red-400 text-xs mt-1.5 font-medium">
                        ⚠️ {formErrors.street}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    {t("common.notesOptional")}
                  </label>
                  <div className="relative">
                    <FileText
                      className={`absolute ${currentLang === "ar" ? "right-4" : "left-4"} top-4 w-4 h-4 text-white/30`}
                    />
                    <textarea
                      name="notes"
                      value={address.notes}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder={t("checkout.specialInstructions")}
                      className={`w-full ${currentLang === "ar" ? "pr-11 pl-4" : "pl-11 pr-4"} py-3 bg-[#0b3b24] text-white border border-white/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#ea580c] focus:border-[#ea580c] transition-all placeholder-white/20 resize-none`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-[#0b3b24]">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-white/10 pb-3 font-serif">
                <CreditCard className="w-5 h-5 text-[#ea580c]" />
                {t("checkout.paymentMethod")}
              </h2>

              <div>
                <label
                  className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                    paymentMethod === "COD"
                      ? "border-[#ea580c] bg-white/5"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="w-4 h-4 accent-[#ea580c]"
                  />
                  <Banknote className="w-6 h-6 text-gray-300" />
                  <div>
                    <span className="font-bold block text-sm">
                      {t("checkout.cashOnDelivery")}
                    </span>
                    <span className="text-xs text-gray-400 block mt-0.5">
                      {t("checkout.payWhenReceive")}
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="md:sticky md:top-8">
            <div className="bg-[#0b3b24] border border-white/10 p-6 rounded-2xl">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-white/10 pb-3 font-serif">
                <ShoppingBag className="w-5 h-5 text-[#ea580c]" />
                {t("checkout.orderSummary")}
              </h2>

              <div className="divide-y divide-white/10 mb-6 max-h-[300px] overflow-y-auto custom-scrollbar">
                {cartItems.map((item: CartItem) => (
                  <div
                    key={item.product._id}
                    className="py-4 flex gap-4 first:pt-0"
                  >
                    <img
                      src={item.product.image || "/placeholder.png"}
                      alt={getLocalizedText(item.product.name)}
                      className="w-14 h-14 object-cover rounded-xl bg-[#0b3b24] border border-white/10 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm truncate">
                        {getLocalizedText(item.product.name)}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {`${t("orderTracking.qty")} ${item.quantity}`}
                      </p>
                      <p className="text-sm font-black font-mono mt-1 text-gray-200">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">
                    {t("checkout.subtotal")}
                  </span>
                  <span className="font-bold font-mono">
                    ${computedTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">
                    {t("checkout.shipping")}
                  </span>
                  <span className="font-bold text-green-400">
                    {t("checkout.free")}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <span className="text-base font-bold font-serif">
                    {t("checkout.grandTotal")}
                  </span>
                  <span className="text-2xl font-black font-mono text-[#ea580c]">
                    ${computedTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={submitting}
                className="w-full mt-8 bg-[#ea580c] text-white py-3.5 rounded-full font-bold tracking-wide hover:bg-[#d94e06] disabled:opacity-40 transition-all flex items-center justify-center gap-2 text-base shadow-sm"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t("checkout.placingOrder")}
                  </>
                ) : (
                  t("checkout.placeOrder")
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
