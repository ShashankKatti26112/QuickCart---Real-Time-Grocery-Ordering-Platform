import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '/store/productSlice';
import { addItem } from '../store/cartSlice';
import { ProductCard } from './ProductCard';

export const ProductList = () => {
  const dispatch = useDispatch();
  const { items, status } = useSelector(state => state.products);
  
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const handleAddToCart = (product) => {
    dispatch(addItem(product));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {status === 'loading' && <p>Loading products...</p>}
      {status === 'succeeded' && items.map(product => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onAddToCart={handleAddToCart} 
        />
      ))}
    </div>
  );
};