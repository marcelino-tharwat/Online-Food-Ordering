// import { useDispatch } from 'react-redux';
// import { cartService } from '../services/cartService';
// import { setLoading, setError, optimisticAddItem } from '../redux/slices/cartSlice';
// import type { AppDispatch } from '../redux/store';

// interface ProductCardProps {
//   id: string;
//   name: string;
//   price: number;
//   image: string;
// }

// export default function ProductCard({ id, name, price, image }: ProductCardProps) {
//   const dispatch = useDispatch<AppDispatch>();

//   const handleAddToCart = async () => {
//     // Create minimal product object for optimistic update
//     const product = {
//       _id: id,
//       name: { en: name, ar: name },
//       price,
//       image,
//     };

//     // Optimistically update UI instantly - no waiting for API
//     dispatch(optimisticAddItem({ productId: id, product }));

//     try {
//       dispatch(setLoading(true));
//       dispatch(setError(null));
//       await cartService.addToCart(id, 1);
//     } catch {
//       dispatch(setError('Failed to add item to cart'));
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

//   return (
//     <div className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'>
//       <img
//         src={image || '/placeholder.png'}
//         alt={name}
//         className='w-full h-48 object-cover'
//       />
//       <div className='p-4'>
//         <h3 className='text-lg font-semibold text-gray-800 mb-2'>{name}</h3>
//         <p className='text-xl font-bold text-blue-600 mb-4'></p>
//         <button
//           onClick={handleAddToCart}
//           className='w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors'
//         >
//           Add to Cart
//         </button>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
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
  const dispatch = useDispatch<AppDispatch>();
  const [isFavorite, setIsFavorite] = useState(false);

  const currentLang = localStorage.getItem("lang") || "en";

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
      dispatch(setError("Failed to add item to cart"));
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

          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
            aria-label="Add to favorites"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={isFavorite ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className={`w-5 h-5 transition-all ${isFavorite ? "text-red-500 scale-110" : ""}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full bg-white text-[#0b3b24] py-2.5 px-4 rounded-full font-bold text-xs md:text-sm hover:bg-yellow-100 active:scale-[0.98] transition-all duration-200 shadow-md flex justify-center items-center"
        >
          {currentLang === "ar" ? "اطلب الآن" : "Order Now"}
        </button>
      </div>
    </div>
  );
}
