import { useSelector, useDispatch } from 'react-redux';
import { removeItem, clearCart } from '../store/cartSlice';
import { Link } from 'react-router-dom';

export const Cart = () => {
  const cartItems = useSelector(state => state.cart.items);
  const total = useSelector(state => state.cart.total);
  const dispatch = useDispatch();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p>${item.price} x {item.quantity}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                  <button 
                    onClick={() => dispatch(removeItem(item.id))}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Total: ${total.toFixed(2)}</h2>
            </div>
            <div className="space-x-4">
              <button 
                onClick={() => dispatch(clearCart())}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Clear Cart
              </button>
              <Link 
                to="/checkout"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Checkout
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};