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
  AlertCircle,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

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

  const checkoutSchema = z.object({
    fullName: z.string().min(3, t("checkout.fullNameRequired")),
    phone: z
      .string()
      .regex(/^01[0-2,5]{1}[0-9]{8}$/, t("checkout.phoneRequired")),
    city: z.string().min(2, t("checkout.cityRequired")),
    street: z.string().min(5, t("checkout.streetRequired")),
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
        t("checkout.placeOrderError", "Failed to place order. Please try again."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-success-bg border border-success/20 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-2xl font-black mb-3 font-serif tracking-tight">
            {t("checkout.orderPlaced")}
          </h2>
          <p className="text-text-secondary text-sm mb-8">
            {t("checkout.successMessage")}
          </p>
          <Button
            onClick={() => navigate("/orders")}
            fullWidth
            size="lg"
          >
            {t("checkout.viewOrders")}
          </Button>
        </div>
      </div>
    );
  }

  if (cartLoading && cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-brand-orange animate-spin" />
          <p className="text-text-secondary text-sm font-medium animate-pulse-soft">
            {t("checkout.loadingCheckout", "Loading checkout...")}
          </p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-brand-orange" />
          </div>
          <h2 className="text-2xl font-black mb-3 font-serif tracking-tight">
            {t("checkout.emptyCart")}
          </h2>
          <p className="text-text-secondary text-sm mb-8">
            {t("checkout.emptyMessage")}
          </p>
          <Button
            onClick={() => navigate("/menu")}
            fullWidth
            size="lg"
          >
            {t("checkout.browseMenu")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-black font-serif tracking-tight mb-8">
          {t("checkout.checkout")}
        </h1>

        {submitError && (
          <div className="bg-error-bg border border-error-border text-error-text px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2" role="alert">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {submitError}
          </div>
        )}

        <div className="grid md:grid-cols-5 gap-6 items-start">
          <div className="md:col-span-3 space-y-6">
            <div className="bg-surface-card border border-border-light rounded-2xl p-6 shadow-lg">
              <h2 className="text-base font-bold mb-5 flex items-center gap-2 text-text-primary">
                <MapPin className="w-4 h-4 text-brand-orange" />
                {t("checkout.deliveryAddress")}
              </h2>

              <div className="space-y-4">
                <Input
                  label={t("common.fullName")}
                  placeholder={t("checkout.namePlaceholder")}
                  value={address.fullName}
                  onChange={handleInputChange}
                  error={formErrors.fullName}
                  icon={<User className="w-4 h-4" />}
                  name="fullName"
                />

                <Input
                  label={t("common.phoneNumber")}
                  placeholder={t("checkout.phonePlaceholder")}
                  value={address.phone}
                  onChange={handleInputChange}
                  error={formErrors.phone}
                  icon={<Phone className="w-4 h-4" />}
                  name="phone"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label={t("common.city")}
                    placeholder={t("checkout.cityPlaceholder")}
                    value={address.city}
                    onChange={handleInputChange}
                    error={formErrors.city}
                    icon={<Building className="w-4 h-4" />}
                    name="city"
                  />

                  <Input
                    label={t("common.street")}
                    placeholder={t("checkout.streetPlaceholder")}
                    value={address.street}
                    onChange={handleInputChange}
                    error={formErrors.street}
                    icon={<MapPin className="w-4 h-4" />}
                    name="street"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold tracking-wide text-text-secondary">
                    {t("common.notesOptional")}
                  </label>
                  <div className="relative">
                    <FileText className="absolute start-3.5 top-3.5 w-4 h-4 text-text-tertiary" />
                    <textarea
                      name="notes"
                      value={address.notes}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder={t("checkout.specialInstructions")}
                      className="w-full ps-10 pe-4 py-3 bg-surface-card text-text-primary border border-border-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange/50 transition-all placeholder:text-text-tertiary/60 text-sm font-medium resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface-card border border-border-light rounded-2xl p-6 shadow-lg">
              <h2 className="text-base font-bold mb-5 flex items-center gap-2 text-text-primary">
                <CreditCard className="w-4 h-4 text-brand-orange" />
                {t("checkout.paymentMethod")}
              </h2>

              <label
                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border ${
                  paymentMethod === "COD"
                    ? "bg-brand-orange/5 border-brand-orange/30"
                    : "bg-white/[0.02] border-border-light hover:border-border-medium"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="w-4 h-4 accent-brand-orange"
                />
                <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center">
                  <Banknote className="w-5 h-5 text-brand-orange" />
                </div>
                <div>
                  <span className="font-bold block text-sm text-text-primary">
                    {t("checkout.cashOnDelivery")}
                  </span>
                  <span className="text-xs text-text-tertiary block mt-0.5">
                    {t("checkout.payWhenReceive")}
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="md:col-span-2 md:sticky md:top-24">
            <div className="bg-surface-card border border-border-light rounded-2xl p-6 shadow-lg">
              <h2 className="text-base font-bold mb-5 flex items-center gap-2 text-text-primary">
                <ShoppingBag className="w-4 h-4 text-brand-orange" />
                {t("checkout.orderSummary")}
              </h2>

              <div className="divide-y divide-border-light mb-5 max-h-[280px] overflow-y-auto scrollbar-thin">
                {cartItems.map((item: CartItem) => (
                  <div
                    key={item.product._id}
                    className="py-3 flex gap-3 first:pt-0"
                  >
                    <img
                      src={item.product.image || "/placeholder.png"}
                      alt={getLocalizedText(item.product.name)}
                      className="w-12 h-12 object-cover rounded-xl bg-surface-overlay border border-border-light flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm text-text-primary truncate">
                        {getLocalizedText(item.product.name)}
                      </h3>
                      <p className="text-xs text-text-tertiary mt-0.5">
                        {t("orderTracking.qty")} {item.quantity}
                      </p>
                      <p className="text-sm font-black font-mono mt-1 text-text-primary">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border-light pt-4 space-y-2.5 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">{t("checkout.subtotal")}</span>
                  <span className="font-bold font-mono text-text-primary">
                    ${computedTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">{t("checkout.shipping")}</span>
                  <span className="font-bold text-success">{t("checkout.free")}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-border-light">
                  <span className="text-base font-bold font-serif text-text-primary">
                    {t("checkout.grandTotal")}
                  </span>
                  <span className="text-xl md:text-2xl font-black font-mono text-brand-orange">
                    ${computedTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                onClick={handlePlaceOrder}
                fullWidth
                size="lg"
                loading={submitting}
                className="mt-6"
              >
                {submitting ? t("checkout.placingOrder") : t("checkout.placeOrder")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
