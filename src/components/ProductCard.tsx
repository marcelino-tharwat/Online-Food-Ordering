import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { cartService } from "../services/cartService";
import {
  setLoading,
  setError,
  optimisticAddItem,
  optimisticRemoveItem,
} from "../redux/slices/cartSlice";
import type { AppDispatch } from "../redux/store";
import { useState, type MouseEvent } from "react";
import { ShoppingCart, Check } from "lucide-react";
import FavoriteButton from "./FavoriteButton";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
}: ProductCardProps) {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isAdding) return;

    const product = {
      _id: id,
      name: { en: name, ar: name },
      price,
      image,
    };

    try {
      setIsAdding(true);
      dispatch(setLoading(true));
      dispatch(setError(null));
      dispatch(
        optimisticAddItem({
          productId: id,
          product,
        }),
      );
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
      await cartService.addToCart(id, 1);
    } catch {
      dispatch(setError(t("cart.addItemError")));
      dispatch(optimisticRemoveItem(id));
    } finally {
      setIsAdding(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="group bg-white border border-border-light rounded-2xl overflow-hidden hover:border-primary/20 hover:shadow-md hover:shadow-primary/5 transition-all duration-300 animate-fade-in flex flex-col">
      <div className="relative overflow-hidden aspect-[4/3] bg-accent">
        <img
          src={image || "/placeholder.png"}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute top-2 start-2 z-10">
          <FavoriteButton productId={id} />
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-text-primary leading-snug line-clamp-1 flex-1">
            {name}
          </h3>
          <span className="text-lg font-bold font-mono text-primary flex-shrink-0 leading-none mt-0.5">
            ${price}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`w-full py-2.5 px-4 rounded-md text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
            justAdded
              ? "bg-success-bg text-success border border-success/30"
              : isAdding
                ? "bg-accent/50 text-text-secondary border border-border-light cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary-hover active:scale-[0.98] shadow-sm"
          }`}
        >
          {justAdded ? (
            <>
              <Check className="w-4 h-4" />
              {t("cart.added", "Added!")}
            </>
          ) : isAdding ? (
            t("cart.adding")
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              {t("checkout.orderNow")}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
