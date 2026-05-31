import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { X, Minus, Plus, ShoppingCart, AlertCircle, Heart } from "lucide-react";
import { cartService } from "../services/cartService";
import { optimisticAddItem } from "../redux/slices/cartSlice";
import { toggleFavorite } from "../redux/slices/favoritesSlice";
import type { AppDispatch, RootState } from "../redux/store";

interface ProductData {
  _id: string;
  name: { en: string; ar: string };
  price: number;
  image: string;
  available: boolean;
}

interface ProductDetailSheetProps {
  product: ProductData | null;
  onClose: () => void;
}

function ProductDetailSheet({ product, onClose }: ProductDetailSheetProps) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const currentLang = (i18n.language as "en" | "ar") || "en";
  const favoriteIds = useSelector((state: RootState) => state.favorites.favoriteIds);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setQuantity(1);
    setError("");
    setAdding(false);
  }, [product?._id]);

  useEffect(() => {
    if (!product) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  const handleAddToCart = useCallback(async () => {
    if (!product || !product.available) return;
    setAdding(true);
    setError("");
    dispatch(
      optimisticAddItem({
        productId: product._id,
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          available: product.available,
        },
        quantity,
      }),
    );
    try {
      await cartService.addToCart(product._id, quantity);
      onClose();
    } catch {
      setError(
        currentLang === "ar" ? "فشلت الإضافة إلى السلة" : "Failed to add to cart",
      );
    } finally {
      setAdding(false);
    }
  }, [product, quantity, dispatch, onClose, currentLang]);

  if (!product) return null;

  const getLocalizedText = (obj: { en: string; ar: string }) =>
    currentLang === "ar" ? obj.ar : obj.en;

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-t-3xl md:rounded-2xl w-full md:max-w-lg md:mx-4 max-h-[90vh] overflow-y-auto animate-slide-up shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 end-4 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm border border-border-light text-text-secondary hover:text-primary hover:bg-accent transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative">
          <img
            src={product.image || "/placeholder.png"}
            alt={getLocalizedText(product.name)}
            className="w-full h-56 md:h-64 object-cover"
          />
          {!product.available && (
            <div className="absolute top-4 start-4 px-3 py-1.5 bg-error/90 text-white text-xs font-bold rounded-md backdrop-blur-sm">
              {t("productDetail.outOfStock")}
            </div>
          )}
        </div>

        <div className="p-5 md:p-6 space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-extrabold text-text-primary">
                {getLocalizedText(product.name)}
              </h2>
              <p className="text-2xl font-bold font-mono text-primary mt-2">
                ${product.price.toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => dispatch(toggleFavorite(product._id))}
              className={`p-2 rounded-full border transition-all flex-shrink-0 ${
                favoriteIds.includes(product._id)
                  ? "bg-error-bg text-error border-error/30"
                  : "border-border-light text-text-tertiary hover:text-error hover:border-error/30"
              }`}
            >
              <Heart
                className={`w-5 h-5 transition-all ${
                  favoriteIds.includes(product._id) ? "fill-error" : "fill-transparent"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-accent/30 rounded-2xl">
            <span className="text-sm font-semibold text-text-secondary">
              {t("productDetail.quantity")}
            </span>
            <div className="flex items-center gap-3 bg-white border border-border-light rounded-md p-0.5">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="p-1.5 rounded text-text-secondary hover:text-primary hover:bg-primary-light/30 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-bold font-mono text-text-primary text-base">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-1.5 rounded text-text-secondary hover:text-primary hover:bg-primary-light/30 transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-error bg-error-bg border border-error-border px-3 py-2 rounded-md">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={!product.available || adding}
            className="w-full flex items-center justify-center gap-3 bg-primary text-white py-3.5 px-6 rounded-md font-bold text-sm hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {adding ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t("productDetail.adding")}
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                {t("productDetail.addToCart")} — ${(product.price * quantity).toFixed(2)}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailSheet;
