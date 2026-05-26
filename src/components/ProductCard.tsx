import { useDispatch } from 'react-redux';
import { cartService } from '../services/cartService';
import { setCartItems, setLoading, setError } from '../redux/slices/cartSlice';
import type { AppDispatch } from '../redux/store';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
}

export default function ProductCard({ id, name, price, image }: ProductCardProps) {
  const dispatch = useDispatch<AppDispatch>();

  const handleAddToCart = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      await cartService.addToCart(id, 1);
      const cartData = await cartService.getCart();
      dispatch(setCartItems({ items: cartData.items, total: cartData.total }));
    } catch (err) {
      dispatch(setError('Failed to add item to cart'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'>
      <img
        src={image || '/placeholder.png'}
        alt={name}
        className='w-full h-48 object-cover'
      />
      <div className='p-4'>
        <h3 className='text-lg font-semibold text-gray-800 mb-2'>{name}</h3>
        <p className='text-xl font-bold text-blue-600 mb-4'></p>
        <button
          onClick={handleAddToCart}
          className='w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors'
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
