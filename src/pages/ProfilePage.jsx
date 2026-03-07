import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import './ProfilePage.css';
import { User, ShoppingBag, Calendar, AlertCircle } from 'lucide-react';

const ProfilePage = () => {
  const { user, profiles } = useAuth();
  const [orders, setOrders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch user's orders in parallel
        const ordersPromise = supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        // Fetch user's appointments in parallel
        const appointmentsPromise = supabase
          .from('appointments')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: true });

        const [{ data: orderData }, { data: apptData }] = await Promise.all([
          ordersPromise,
          appointmentsPromise,
        ]);

        if (orderData) setOrders(orderData);
        if (apptData) setAppointments(apptData);

      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <div className="loading-state">Loading your profile...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your details, view orders, and see upcoming appointments.</p>
        </div>

        <div className="profile-grid">
          {/* Profile Details Card */}
          <div className="profile-card">
            <h3><User className="card-icon" /> My Details</h3>
            <div className="detail-item">
              <span className="detail-label">Name</span>
              <span className="detail-value">{profiles?.full_name || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email</span>
              <span className="detail-value">{user?.email || 'N/A'}</span>
            </div>
            {/* Add buttons here for editing */}
          </div>

          {/* Order History Card */}
          <div className="profile-card">
            <h3><ShoppingBag className="card-icon" /> Order History</h3>
            {orders.length > 0 ? (
              <ul className="item-list">
                {orders.map(order => (
                  <li key={order.id}>
                    <span>Order #{order.id.substring(0, 8).toUpperCase()}</span>
                    <span>{new Date(order.created_at).toLocaleDateString()}</span>
                    <span>₹{order.total_amount}</span>
                    <span className={`status status-${order.status.toLowerCase()}`}>{order.status}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-state">
                <ShoppingBag size={40} />
                <p>You haven't placed any orders yet.</p>
              </div>
            )}
          </div>

          {/* Appointments Card */}
          <div className="profile-card">
            <h3><Calendar className="card-icon" /> Upcoming Appointments</h3>
            {appointments.length > 0 ? (
              <ul className="item-list">
                {appointments.map(appt => (
                  <li key={appt.id}>
                    <span>{new Date(appt.date).toLocaleDateString()}</span>
                    <span>{appt.doctor_name}</span>
                    <span className={`status status-${appt.status.toLowerCase()}`}>{appt.status}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-state">
                <Calendar size={40} />
                <p>You have no upcoming appointments.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;