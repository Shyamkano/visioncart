import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './CartPage.css';
import { Trash2, ShoppingCart } from 'lucide-react';

const CartPage = () => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    const fetchCartItems = async () => {
        if (!user) { setLoading(false); return; }
        setLoading(true);
        const { data, error } = await supabase
            .from('cart')
            .select('*, products(*)')
            .eq('user_id', user.id);

        if (error) {
            console.error("Error fetching cart items:", error);
        } else {
            // Filter out cart items where the product was deleted
            const validItems = data ? data.filter(item => item.products !== null && item.products !== undefined) : [];
            setCartItems(validItems);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCartItems();
    }, [user]);

    const handleRemoveItem = async (productId) => {
        const { error } = await supabase.from('cart').delete().match({ user_id: user.id, product_id: productId });
        if (error) alert(`Error removing item: ${error.message}`);
        else fetchCartItems();
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) return;
        setIsProcessing(true);

        // 1. Create a new order in the 'orders' table
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert({ user_id: user.id, total_amount: cartTotal, status: 'Processing' })
            .select()
            .single();

        if (orderError) {
            alert(`Error creating order: ${orderError.message}`);
            setIsProcessing(false);
            return;
        }

        // 2. Clear the user's cart
        const { error: clearCartError } = await supabase.from('cart').delete().eq('user_id', user.id);
        if (clearCartError) {
            alert('Your order was placed, but we could not clear your cart.');
        }

        // 3. Redirect to the profile page to see the new order
        alert(`Order #${orderData.id.substring(0, 8)} placed successfully!`);
        navigate('/profile');
        setIsProcessing(false);
    };

    const cartTotal = cartItems.reduce((total, item) => {
        if (!item.products) return total;
        return total + (item.products.price || 0) * (item.quantity || 1);
    }, 0);
    if (loading) return <div className="loading-state">Loading Your Cart...</div>;
    if (!user) return <div className="cart-container"><p>Please log in to view your cart.</p></div>;

    return (
        <div className="cart-container">
            <div className="cart-content">
                <div className="cart-header">
                    <h1>My Shopping Cart</h1>
                </div>
                {cartItems.length > 0 ? (
                    <div className="cart-layout">
                        <div className="cart-items-list">
                            {cartItems.map(item => (
                                <div key={item.products.id} className="cart-item-card">
                                    <img src={item.products.image_url} alt={item.products.name} />
                                    <div className="item-details">
                                        <p className="item-brand">{item.products.brand}</p>
                                        <h3>{item.products.name}</h3>
                                    </div>
                                    <p className="item-price">₹{item.products.price}</p>
                                    <button className="remove-item-btn" onClick={() => handleRemoveItem(item.products.id)}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="cart-summary">
                            <h3>Order Summary</h3>
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>₹{cartTotal}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span>FREE</span>
                            </div>
                            <div className="summary-total">
                                <span>Total</span>
                                <span>₹{cartTotal}</span>
                            </div>
                            <button className="checkout-btn" onClick={handleCheckout} disabled={isProcessing}>
                                {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="empty-cart">
                        <ShoppingCart size={48} />
                        <p>Your cart is empty.</p>
                        <Link to="/shop" className="primary-btn">Continue Shopping</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;