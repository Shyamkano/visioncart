import React, { useState, useEffect } from 'react';
import './AdminPage.css';
import { LayoutDashboard, ShoppingBag, Box, Users, Calendar, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import NewProductForm from './NewProductForm';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('Products');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewProductForm, setShowNewProductForm] = useState(false);

  // Configuration for each tab to make data fetching generic and clean
  const navItems = [
    { name: 'Products', icon: <ShoppingBag size={20} />, table: 'products', select: '*' },
    { name: 'Orders', icon: <Box size={20} />, table: 'orders', select: '*, profiles(full_name)' }, // Fetches related user name
    { name: 'Users', icon: <Users size={20} />, table: 'profiles', select: '*' },
    { name: 'Appointments', icon: <Calendar size={20} />, table: 'appointments', select: '*, profiles(full_name)' }, // Fetches related user name
  ];

  const fetchData = async () => {
    setLoading(true);
    const currentTab = navItems.find(item => item.name === activeTab);
    if (!currentTab) {
      setLoading(false);
      return;
    }

    const { data: fetchedData, error } = await supabase
      .from(currentTab.table)
      .select(currentTab.select)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching ${currentTab.table}:`, error);
    } else {
      setData(fetchedData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to permanently delete this product?")) {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) {
        alert(`Error deleting product: ${error.message}`);
      } else {
        alert("Product deleted successfully.");
        fetchData(); // Refresh the product list
      }
    }
  };

  const handleProductAdded = () => {
    setShowNewProductForm(false);
    fetchData(); // Refetch products after adding a new one
  };

  const renderContent = () => {
    if (loading) return <div className="loading-spinner">Loading Data...</div>;
    if (data.length === 0) return <div className="loading-spinner">No data found.</div>;

    switch (activeTab) {
      case 'Products':
        return (
          <table className="data-table">
            <thead><tr><th>Name</th><th>Brand</th><th>Style</th><th>Price</th><th>Actions</th></tr></thead>
            <tbody>
              {data.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td><td>{item.brand}</td><td>{item.style}</td><td>₹{item.price}</td>
                  <td><button className="delete-btn" onClick={() => handleDeleteProduct(item.id)}><Trash2 size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'Users':
        return (
          <table className="data-table">
            <thead><tr><th>Full Name</th><th>Is Admin?</th><th>Joined On</th></tr></thead>
            <tbody>
              {data.map(item => (
                <tr key={item.id}>
                  <td>{item.full_name}</td>
                  <td>{item.is_admin ? 'Yes' : 'No'}</td>
                  <td>{new Date(item.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'Orders':
        return (
          <table className="data-table">
            <thead><tr><th>Order ID</th><th>User Name</th><th>Total Amount</th><th>Status</th></tr></thead>
            <tbody>
              {data.map(item => (
                <tr key={item.id}>
                  <td>{item.id.substring(0, 8).toUpperCase()}</td>
                  <td>{item.profiles?.full_name || 'N/A'}</td>
                  <td>₹{item.total_amount}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'Appointments':
        return (
          <table className="data-table">
            <thead><tr><th>User Name</th><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th></tr></thead>
            <tbody>
              {data.map(item => (
                <tr key={item.id}>
                  <td>{item.profiles?.full_name || 'N/A'}</td>
                  <td>{item.doctor_name}</td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td>{item.time}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-dashboard">
        <aside className="admin-sidebar">
          <h2><LayoutDashboard size={24} /> Admin Panel</h2>
          <nav>
            <ul className="admin-nav">
              {navItems.map(item => (
                <li key={item.name} className="admin-nav-item">
                  <a href="#" className={`admin-nav-link ${activeTab === item.name ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); setActiveTab(item.name); }}>
                    {item.icon}<span>{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="admin-main-content">
          <div className="admin-header">
            <h1>{navItems.find(i => i.name === activeTab)?.icon} Manage {activeTab}</h1>
            {activeTab === 'Products' && (
              <button className="new-product-btn" onClick={() => setShowNewProductForm(!showNewProductForm)}>
                <Plus size={16} /> {showNewProductForm ? 'Cancel' : 'New Product'}
              </button>
            )}
          </div>
          {showNewProductForm && <NewProductForm onProductAdded={handleProductAdded} />}
          <div className="data-table-container">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;