import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { cartService } from "../services/cartService";
import {
  setLoading,
  setError,
  optimisticAddItem,
} from "../redux/slices/cartSlice";
import type { AppDispatch } from "../redux/store";

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

  const handleAddToCart = async () => {
    const product = {
      _id: id,
      name: { en: name, ar: name },
      price,
      image,
    };

    dispatch(optimisticAddItem({ productId: id, product }));

    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      await cartService.addToCart(id, 1);
    } catch {
      dispatch(setError(t("cart.addItemError")));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="bg-[#0c4228]/60 border border-[#1a5f3e]/40 rounded-2xl p-4 flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 group">
      <div className="relative rounded-xl overflow-hidden aspect-square mb-4 bg-[#0a3520]">
        <img
          src={image || "/placeholder.png"}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="flex flex-col flex-grow justify-between">
        <div className="flex justify-between items-start gap-2 mb-4">
          <div>
            <h3 className="text-base md:text-lg font-bold text-white tracking-wide line-clamp-1">
              {name}
            </h3>
            <p className="text-lg font-extrabold text-white mt-1">${price}</p>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full bg-white text-[#0b3b24] py-2.5 px-4 rounded-full font-bold text-xs md:text-sm hover:bg-yellow-100 active:scale-[0.98] transition-all duration-200 shadow-md flex justify-center items-center"
        >
          {t("checkout.orderNow")}
        </button>
      </div>
    </div>
  );
}
