import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cartService } from "../services/cartService";
import {
  setCartItems,
  optimisticUpdateQuantity,
  optimisticRemoveItem,
  setLoading,
  setError,
  clearCart,
  type CartItem,
  type LocalizedText,
} from "../redux/slices/cartSlice";
import type { RootState, AppDispatch } from "../redux/store";
import { Trash2, Plus, Minus, ShoppingBag, Loader2 } from "lucide-react";

function Cart() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language as "en" | "ar") || "en";
  const { cartItems, loading, error } = useSelector(
    (state: RootState) => state.cart,
  );
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const getLocalizedText = (obj: LocalizedText | undefined): string => {
    if (!obj) return "";
    return currentLang === "ar" ? obj.ar : obj.en;
  };

  useEffect(() => {
    void fetchCart();
  }, [dispatch, t]);

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

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    dispatch(optimisticUpdateQuantity({ productId, quantity }));
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      await cartService.updateCart(productId, quantity);
    } catch {
      dispatch(setError(t("cart.updateQuantityError")));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleRemoveItem = async (productId: string) => {
    dispatch(optimisticRemoveItem(productId));
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      await cartService.removeFromCart(productId);
    } catch {
      dispatch(setError(t("cart.removeItemError")));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleClearCart = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      await cartService.clearCart();
      dispatch(clearCart());
    } catch {
      dispatch(setError(t("cart.emptyCartError")));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const computedTotal = (cartItems || []).reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  if (loading && (cartItems || []).length === 0) {
    return (
      <div className="min-h-[80vh] bg-[#0b3b24] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#ea580c] animate-spin" />
          <p className="text-gray-300 font-medium">{t("cart.loadingCart")}</p>
        </div>
      </div>
    );
  }

  if (error && (cartItems || []).length === 0) {
    return (
      <div className="min-h-[80vh] bg-[#0b3b24] flex items-center justify-center text-white p-4">
        <div className="text-center max-w-sm">
          <p className="text-red-400 text-lg mb-6 font-medium">⚠️ {error}</p>
          <button
            onClick={fetchCart}
            className="bg-[#ea580c] text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-[#d94e06] transition-all"
          >
            {t("common.tryAgain")}
          </button>
        </div>
      </div>
    );
  }

  if ((cartItems || []).length === 0) {
    return (
      <div className="min-h-[80vh] bg-[#0b3b24] flex items-center justify-center text-white p-4">
        <div className="text-center max-w-sm">
          <ShoppingBag className="w-16 h-16 text-[#ea580c] mx-auto mb-6 opacity-90" />
          <h2 className="text-2xl font-black mb-3 font-serif">
            {t("cart.yourCartEmpty")}
          </h2>
          <p className="text-gray-400 text-sm mb-8">{t("cart.emptyMessage")}</p>
          <button
            onClick={() => navigate("/menu")}
            className="bg-[#ea580c] text-white px-8 py-3.5 rounded-full font-bold shadow-sm hover:bg-[#d94e06] transition-all inline-block w-full text-center"
          >
            {t("cart.browseMenu")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b3b24] py-12 text-white font-sans">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-black mb-10 font-serif tracking-wide">
          {t("cart.yourCart")}
        </h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <div className="space-y-6 mb-10">
          {(cartItems || []).map((item: CartItem) => (
            <div
              key={item.product._id}
              className="pb-6 flex flex-col sm:flex-row items-center gap-6 border-b border-white/10 last:border-0"
            >
              <img
                src={item.product.image || "/placeholder.png"}
                alt={getLocalizedText(item.product.name)}
                className="w-20 h-20 object-cover rounded-xl bg-[#0b3b24] border border-white/10"
              />

              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-bold">
                  {getLocalizedText(item.product.name)}
                </h3>
                <p className="text-gray-400 text-sm mt-1 font-mono">
                  ${item.product.price.toFixed(2)}
                </p>
              </div>

              <div className="flex items-center gap-4 bg-[#0b3b24] border border-white/20 px-3 py-1.5 rounded-full">
                <button
                  onClick={() =>
                    handleUpdateQuantity(item.product._id, item.quantity - 1)
                  }
                  disabled={
                    actionLoading === item.product._id || item.quantity <= 1
                  }
                  className="p-1 text-gray-400 hover:text-white disabled:opacity-20 transition-all"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <span className="w-6 text-center font-bold font-mono text-sm">
                  {item.quantity}
                </span>

                <button
                  onClick={() =>
                    handleUpdateQuantity(item.product._id, item.quantity + 1)
                  }
                  disabled={actionLoading === item.product._id}
                  className="p-1 text-gray-400 hover:text-white disabled:opacity-20 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-lg font-black font-mono w-24 text-center sm:text-right">
                ${(item.product.price * item.quantity).toFixed(2)}
              </div>

              <button
                onClick={() => handleRemoveItem(item.product._id)}
                disabled={actionLoading === item.product._id}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-full"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-bold text-gray-300 font-serif">
              {t("checkout.orderSummary")}
            </h2>
            <div className="text-3xl font-black font-mono text-[#ea580c]">
              ${computedTotal.toFixed(2)}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleClearCart}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-3.5 border border-white/20 text-gray-300 rounded-full font-semibold hover:text-red-400 hover:border-red-400/40 disabled:opacity-50 transition-all text-sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              {t("cart.clearCart")}
            </button>

            <button
              onClick={() => navigate("/checkout")}
              className="flex-1 flex items-center justify-center gap-2 bg-[#ea580c] text-white py-3.5 px-6 rounded-full font-bold tracking-wide hover:bg-[#d94e06] transition-all text-base shadow-sm"
            >
              {t("cart.proceedCheckout")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
