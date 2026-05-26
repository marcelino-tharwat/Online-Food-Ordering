import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cartService } from "../services/cartService";
import {
  setCartItems,
  setLoading,
  setError,
  type CartItem,
  type LocalizedText,
} from "../redux/slices/cartSlice";
import type { RootState, AppDispatch } from "../redux/store";
import { Trash2, Plus, Minus, ShoppingBag, Loader2 } from "lucide-react";

function Cart() {
  const dispatch = useDispatch<AppDispatch>();
  const { cartItems, loading, error, total } = useSelector(
    (state: RootState) => state.cart,
  );
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const currentLang = localStorage.getItem("lang") || "en";

  const getLocalizedText = (obj: LocalizedText | undefined): string => {
    if (!obj) return "";
    return currentLang === "ar" ? obj.ar : obj.en;
  };

  useEffect(() => {
    fetchCart();
  }, [dispatch]);

  const fetchCart = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const cartData = await cartService.getCart();
      dispatch(setCartItems(cartData));
    } catch (err) {
      dispatch(setError("Failed to load cart"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setActionLoading(productId);
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      await cartService.updateCart(productId, quantity);
      await fetchCart();
    } catch (err) {
      dispatch(setError("Failed to update quantity"));
    } finally {
      dispatch(setLoading(false));
      setActionLoading(null);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    setActionLoading(productId);
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      await cartService.removeFromCart(productId);
      await fetchCart();
    } catch (err) {
      dispatch(setError("Failed to remove item"));
    } finally {
      dispatch(setLoading(false));
      setActionLoading(null);
    }
  };

  const handleClearCart = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      await cartService.clearCart();
      dispatch(setCartItems({ items: [], total: 0 }));
    } catch (err) {
      dispatch(setError("Failed to clear cart"));
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error && (cartItems || []).length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={fetchCart}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if ((cartItems || []).length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-gray-500 mb-6">
            Looks like you haven't added anything to your cart yet.
          </p>
          <a
            href="/menu"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block"
          >
            Browse Menu
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="divide-y divide-gray-200">
            {(cartItems || []).map((item: CartItem) => (
              <div
                key={item.product._id}
                className="p-6 flex items-center gap-6"
              >
                <img
                  src={item.product.image || "/placeholder.png"}
                  alt={getLocalizedText(item.product.name)}
                  className="w-24 h-24 object-cover rounded-lg bg-gray-100"
                />

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {getLocalizedText(item.product.name)}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    ${item.product.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.product._id, item.quantity - 1)
                    }
                    disabled={
                      actionLoading === item.product._id || item.quantity <= 1
                    }
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <span className="w-12 text-center font-medium">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.product._id, item.quantity + 1)
                    }
                    disabled={actionLoading === item.product._id}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-lg font-semibold text-gray-800 w-24 text-right">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>

                <button
                  onClick={() => handleRemoveItem(item.product._id)}
                  disabled={actionLoading === item.product._id}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Order Summary
            </h2>
            <div className="text-2xl font-bold text-gray-800">
              Total: ${computedTotal.toFixed(2)}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleClearCart}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Clear Cart
            </button>

            <a
              href="/checkout"
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Proceed to Checkout
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
