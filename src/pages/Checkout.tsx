import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { cartService } from "../services/cartService";
import { setCartItems, setLoading, setError, type CartItem, type LocalizedText } from "../redux/slices/cartSlice";
import type { RootState, AppDispatch } from "../redux/store";
import { Loader2, ShoppingBag, CreditCard, Banknote, MapPin, Phone, User, Building, FileText, CheckCircle } from "lucide-react";

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
  const { cartItems, loading: cartLoading, error: cartError } = useSelector(
    (state: RootState) => state.cart,
  );
  const currentLang = localStorage.getItem("lang") || "en";

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
      fetchCart();
    }
  }, []);

  const fetchCart = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const cartData = await cartService.getCart();
      dispatch(setCartItems(cartData));
    } catch {
      dispatch(setError("Failed to load cart"));
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

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!address.fullName.trim()) {
      errors.fullName = "Full name is required";
    }
    if (!address.phone.trim()) {
      errors.phone = "Phone number is required";
    }
    if (!address.city.trim()) {
      errors.city = "City is required";
    }
    if (!address.street.trim()) {
      errors.street = "Street address is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
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
      setSubmitError("Your cart is empty");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const orderData = {
        address: {
          fullName: address.fullName.trim(),
          phone: address.phone.trim(),
          city: address.city.trim(),
          street: address.street.trim(),
          notes: address.notes.trim(),
        },
        paymentMethod,
        items: cartItems,
      };

      await api.post("/orders", orderData);

      // Clear cart via backend
      await cartService.clearCart();
      // Refresh Redux cart state
      dispatch(setCartItems({ items: [], total: 0 }));

      setSuccess(true);
    } catch {
      setSubmitError("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-20 h-20 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Order Placed Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Your order has been placed and is being processed.
          </p>
          <button
            onClick={() => navigate("/orders")}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Your Orders
          </button>
        </div>
      </div>
    );
  }

  if (cartLoading && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <ShoppingBag className="w-20 h-20 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-gray-600 mb-6">
            Add some items to your cart before checking out.
          </p>
          <a
            href="/menu"
            className="block w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Menu
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {submitError}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Address & Payment */}
          <div className="space-y-6">
            {/* Address Form */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Delivery Address
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={address.fullName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        formErrors.fullName ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </div>
                  {formErrors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={address.phone}
                      onChange={handleInputChange}
                      placeholder="+1 234 567 8900"
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        formErrors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleInputChange}
                      placeholder="New York"
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        formErrors.city ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </div>
                  {formErrors.city && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="street"
                      value={address.street}
                      onChange={handleInputChange}
                      placeholder="123 Main St, Apt 4B"
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                        formErrors.street ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </div>
                  {formErrors.street && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.street}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (Optional)
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <textarea
                      name="notes"
                      value={address.notes}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Any special instructions..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Payment Method
              </h2>

              <div className="space-y-3">
                <label
                  className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === "COD"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="w-4 h-4 text-blue-600"
                  />
                  <Banknote className="w-6 h-6 text-gray-600" />
                  <div>
                    <span className="font-medium text-gray-800">
                      Cash on Delivery
                    </span>
                    <p className="text-sm text-gray-500">
                      Pay when you receive your order
                    </p>
                  </div>
                </label>

              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
                Order Summary
              </h2>

              <div className="divide-y divide-gray-200 mb-6">
                {cartItems.map((item: CartItem) => (
                  <div key={item.product._id} className="py-4 flex gap-4">
                    <img
                      src={item.product.image || "/placeholder.png"}
                      alt={getLocalizedText(item.product.name)}
                      className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 truncate">
                        {getLocalizedText(item.product.name)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-medium text-gray-800">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-800">
                    ${computedTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-gray-800">Free</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="text-lg font-semibold text-gray-800">Total</span>
                  <span className="text-xl font-bold text-gray-800">
                    ${computedTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={submitting}
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  "Place Order"
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