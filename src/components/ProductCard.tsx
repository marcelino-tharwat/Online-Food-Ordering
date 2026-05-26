import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import type { AppDispatch } from '../redux/store';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
}

export default function ProductCard({ id, name, price, image }: ProductCardProps) {
  const dispatch = useDispatch<AppDispatch>();

  const handleAddToCart = () => {
    dispatch(addToCart({ id, name, price, quantity: 1 }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={image || '/placeholder.png'}
        alt={name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{name}</h3>
        <p className="text-xl font-bold text-blue-600 mb-4">${price.toFixed(2)}</p>
        <button
          onClick={handleAddToCart}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
