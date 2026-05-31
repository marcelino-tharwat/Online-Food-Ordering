import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import type { RootState, AppDispatch } from "../redux/store";
import { optimisticUpdateQuantity, optimisticRemoveItem } from "../redux/slices/cartSlice";
import { cartService } from "../services/cartService";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const currentLang = (i18n.language as "en" | "ar") || "en";
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const Arrow = currentLang === "ar" ? ArrowLeft : ArrowRight;

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const computedTotal = (cartItems || []).reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    dispatch(optimisticUpdateQuantity({ productId, quantity }));
    try {
      await cartService.updateCart(productId, quantity);
    } catch {
      // revert handled by service
    }
  };

  const handleRemoveItem = async (productId: string) => {
    dispatch(optimisticRemoveItem(productId));
    try {
      await cartService.removeFromCart(productId);
    } catch {
      // revert handled by service
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  const getLocalizedText = (obj: { en: string; ar: string } | undefined) => {
    if (!obj) return "";
    return currentLang === "ar" ? obj.ar : obj.en;
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-[55]" onClick={onClose}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
        </div>
      )}
      <div
        className={`fixed top-0 right-0 z-[60] h-full w-full max-w-sm bg-white shadow-xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border-light">
            <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-primary" />
              {t("cart.miniCartTitle")}
              {cartItems && cartItems.length > 0 && (
                <span className="text-xs font-semibold text-text-tertiary">
                  ({cartItems.length})
                </span>
              )}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-text-tertiary hover:text-primary hover:bg-accent transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {!cartItems || cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="w-14 h-14 rounded-2xl bg-primary-light flex items-center justify-center mb-4">
                  <ShoppingBag className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-semibold text-text-secondary">
                  {t("cart.miniCartEmpty")}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border-light">
                {cartItems.map((item) => (
                  <div key={item.product._id} className="p-4 flex gap-3">
                    <img
                      src={item.product.image || "/placeholder.png"}
                      alt={getLocalizedText(item.product.name)}
                      className="w-14 h-14 object-cover rounded-xl bg-accent border border-border-light flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-text-primary truncate">
                        {getLocalizedText(item.product.name)}
                      </h3>
                      <p className="text-xs font-mono text-primary font-bold mt-0.5">
                        ${item.product.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2 bg-accent/50 border border-border-light rounded-md p-0.5 w-fit">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.product._id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="p-1 rounded text-text-tertiary hover:text-primary hover:bg-primary-light/30 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-semibold font-mono text-xs text-text-primary">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.product._id, item.quantity + 1)
                          }
                          className="p-1 rounded text-text-tertiary hover:text-primary hover:bg-primary-light/30 transition-all"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold font-mono text-text-primary">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.product._id)}
                        className="mt-2 text-xs text-text-tertiary hover:text-error transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cartItems && cartItems.length > 0 && (
            <div className="border-t border-border-light p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-text-secondary">
                  {t("cart.subtotal")}
                </span>
                <span className="text-lg font-bold font-mono text-primary">
                  ${computedTotal.toFixed(2)}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-md font-bold text-sm hover:bg-primary-hover transition-all shadow-sm"
              >
                {t("cart.proceedCheckout")}
                <Arrow className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CartDrawer;
