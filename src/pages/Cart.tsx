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
import { Trash2, Plus, Minus, ShoppingBag, Loader2, ArrowRight, ArrowLeft } from "lucide-react";

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
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-text-secondary text-sm font-medium">{t("cart.loadingCart")}</p>
        </div>
      </div>
    );
  }

  if (error && (cartItems || []).length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <p className="text-error-text text-lg mb-6 font-medium">{error}</p>
          <button
            onClick={fetchCart}
            className="px-6 py-3 bg-primary text-white rounded-md font-semibold hover:bg-primary-hover transition-all shadow-sm"
          >
            {t("common.tryAgain")}
          </button>
        </div>
      </div>
    );
  }

  if ((cartItems || []).length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="text-center max-w-sm animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary-light flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-text-primary">
            {t("cart.yourCartEmpty")}
          </h2>
          <p className="text-text-secondary text-sm mb-8">{t("cart.emptyMessage")}</p>
          <button
            onClick={() => navigate("/menu")}
            className="px-8 py-3.5 bg-primary text-white rounded-md font-semibold shadow-sm hover:bg-primary-hover transition-all inline-flex items-center gap-2"
          >
            {t("cart.browseMenu")}
          </button>
        </div>
      </div>
    );
  }

  const Arrow = currentLang === "ar" ? ArrowLeft : ArrowRight;

  return (
    <div className="py-8 md:py-12 px-4 md:px-8 bg-surface-mint min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-primary mb-8">
          {t("cart.yourCart")}
        </h1>

        {error && (
          <div className="bg-error-bg border border-error-border text-error-text px-4 py-3 rounded-md mb-6 text-sm flex items-center gap-2" role="alert">
            <Loader2 className="w-4 h-4 flex-shrink-0 animate-spin" />
            {error}
          </div>
        )}

        <div className="bg-white border border-border-light rounded-2xl overflow-hidden shadow-sm">
          <div className="divide-y divide-border-light">
            {(cartItems || []).map((item: CartItem) => (
              <div
                key={item.product._id}
                className="p-4 md:p-5 flex items-center gap-4 animate-fade-in"
              >
                <img
                  src={item.product.image || "/placeholder.png"}
                  alt={getLocalizedText(item.product.name)}
                  className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl bg-accent border border-border-light flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm md:text-base font-semibold text-text-primary truncate">
                    {getLocalizedText(item.product.name)}
                  </h3>
                  <p className="text-xs text-text-tertiary mt-0.5 font-mono">
                    ${item.product.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-accent/50 border border-border-light rounded-md p-0.5">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.product._id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    className="p-1.5 rounded text-text-secondary hover:text-primary hover:bg-primary-light/30 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-semibold font-mono text-sm text-text-primary">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.product._id, item.quantity + 1)
                    }
                    className="p-1.5 rounded text-text-secondary hover:text-primary hover:bg-primary-light/30 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right flex-shrink-0 min-w-[80px]">
                  <p className="text-base font-bold font-mono text-primary">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() => handleRemoveItem(item.product._id)}
                  className="p-2 rounded-md text-text-tertiary hover:text-error hover:bg-error-bg transition-all flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="p-5 md:p-6 border-t border-border-light bg-accent/20">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-semibold text-text-secondary">
                {t("checkout.orderSummary")}
              </span>
              <div className="text-2xl md:text-3xl font-bold font-mono text-primary">
                ${computedTotal.toFixed(2)}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleClearCart}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-5 py-3 border border-border-medium text-text-secondary rounded-md font-medium hover:text-error hover:border-error/40 disabled:opacity-50 transition-all text-sm"
              >
                <Trash2 className="w-4 h-4" />
                {t("cart.clearCart")}
              </button>

              <button
                onClick={() => navigate("/checkout")}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 px-6 rounded-md font-semibold hover:bg-primary-hover transition-all text-base shadow-sm"
              >
                {t("cart.proceedCheckout")}
                <Arrow className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
