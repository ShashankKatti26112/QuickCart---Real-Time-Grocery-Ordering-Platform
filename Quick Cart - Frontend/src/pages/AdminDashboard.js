import { useState } from 'react';
import { useSelector } from 'react-redux';
import { ProductForm } from '../components/ProductForm';
import { OrderManagement } from '../components/OrderManagement';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const { role } = useSelector(state => state.auth);

  if (role !== 'admin') {
    return <div>Access denied. Admin privileges required.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'products' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'orders' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>
      
      {activeTab === 'products' && <ProductForm />}
      {activeTab === 'orders' && <OrderManagement />}
    </div>
  );
};