import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../redux/slices/favoritesSlice";
import type { RootState } from "../redux/store";
import { Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FavoriteButtonProps {
  productId: string;
  className?: string;
  size?: "sm" | "md";
}

function FavoriteButton({ productId, className = "", size = "sm" }: FavoriteButtonProps) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const favoriteIds = useSelector((state: RootState) => state.favorites.favoriteIds);
  const isFavorite = favoriteIds.includes(productId);

  const sizeClass = size === "sm" ? "w-8 h-8" : "w-10 h-10";
  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(toggleFavorite(productId));
      }}
      className={`${sizeClass} rounded-full flex items-center justify-center transition-all duration-200 ${
        isFavorite
          ? "bg-error-bg text-error hover:bg-error/20"
          : "bg-white/90 backdrop-blur-sm text-text-tertiary hover:text-error hover:bg-error-bg border border-border-light"
      } ${className}`}
      title={isFavorite ? t("favorites.removeFromFavorites") : t("favorites.addToFavorites")}
    >
      <Heart
        className={`${iconSize} transition-all ${
          isFavorite ? "fill-error" : "fill-transparent"
        }`}
      />
    </button>
  );
}

export default FavoriteButton;
