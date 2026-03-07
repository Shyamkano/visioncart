import React, { useState, useEffect, useMemo } from "react";
import "./Shop.css";
import { ShoppingCart, X } from 'lucide-react';
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

// A simple notification component for user feedback
const Notification = ({ message, show }) => {
    if (!show) return null;
    return <div className="notification">{message}</div>;
};

export default function ShopPage() {
    const { user } = useAuth();
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [notification, setNotification] = useState({ show: false, message: '' });

    // --- Filter states ---
    const [searchTerm, setSearchTerm] = useState("");
    const [priceLimit, setPriceLimit] = useState(50000);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedStyles, setSelectedStyles] = useState([]);
    const [sortOrder, setSortOrder] = useState("");

    const brands = useMemo(() => [...new Set(allProducts.map(p => p.brand).filter(Boolean))], [allProducts]);
    const styles = useMemo(() => [...new Set(allProducts.map(p => p.style).filter(Boolean))], [allProducts]);

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            const { data, error } = await supabase.from("products").select("*").order('created_at', { ascending: false });
            if (error) {
                console.error("Error fetching products:", error);
            } else {
                setAllProducts(data || []);
            }
            setLoading(false);
        }
        fetchProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        let products = [...allProducts];
        if (searchTerm) products = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        products = products.filter(p => p.price <= priceLimit);
        if (selectedBrands.length > 0) products = products.filter(p => selectedBrands.includes(p.brand));
        if (selectedStyles.length > 0) products = products.filter(p => selectedStyles.includes(p.style));
        if (sortOrder) {
            products.sort((a, b) => {
                switch (sortOrder) {
                    case "price-asc": return a.price - b.price;
                    case "price-desc": return b.price - a.price;
                    case "name-asc": return a.name.localeCompare(b.name);
                    case "name-desc": return b.name.localeCompare(a.name);
                    default: return 0;
                }
            });
        }
        return products;
    }, [searchTerm, priceLimit, selectedBrands, selectedStyles, sortOrder, allProducts]);

    const showNotification = (message) => {
        setNotification({ show: true, message });
        setTimeout(() => setNotification({ show: false, message: '' }), 3000);
    };

    const handleAddToCart = async (product) => {
        if (!user) {
            showNotification("Please log in to add items to your cart.");
            return;
        }
        const { error } = await supabase.from('cart').upsert({ user_id: user.id, product_id: product.id, quantity: 1 }, { onConflict: 'user_id, product_id' });
        if (error) {
            showNotification(`Error: Could not add ${product.name} to cart.`);
        } else {
            showNotification(`${product.name} added to cart!`);
        }
    };

    const handleBrandChange = (brand) => setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
    const handleStyleChange = (style) => setSelectedStyles(prev => prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]);
    const clearFilters = () => { setSearchTerm(""); setPriceLimit(50000); setSelectedBrands([]); setSelectedStyles([]); setSortOrder(""); };

    return (
        <div className="shop-container">
            <div className="shop-header">
                <h1>Our Collection</h1>
            </div>

            <div className="shop-main-content">

                {/* === FILTERS SIDEBAR === */}
                <button
                    className="mobile-filter-toggle"
                    onClick={() => document.querySelector('.filters').classList.toggle('active')}
                >
                    <ShoppingCart size={16} /> Filters
                </button>
                <aside className="filters">
                    <div className="filter-group">
                        <h3>Price</h3>
                        <label className="price-range-label">
                            <span>₹0</span>
                            <span>₹{priceLimit}</span>
                        </label>
                        <input type="range" min="0" max="50000" step="100" value={priceLimit} onChange={e => setPriceLimit(Number(e.target.value))} />
                    </div>
                    <div className="filter-group">
                        <h3>Brand</h3>
                        {brands.map(brand => (
                            <label key={brand}>
                                <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => handleBrandChange(brand)} /> {brand}
                            </label>
                        ))}
                    </div>
                    <div className="filter-group">
                        <h3>Style</h3>
                        {styles.map(style => (
                            <label key={style}>
                                <input type="checkbox" checked={selectedStyles.includes(style)} onChange={() => handleStyleChange(style)} /> {style}
                            </label>
                        ))}
                    </div>
                    <button onClick={clearFilters} className="clear-filters-btn">Clear All Filters</button>
                </aside>

                {/* --- Main Content --- */}
                <main className="main-content">
                    {/* === CONTROLS (FULLY RESTORED) === */}
                    <div className="shop-controls">
                        <input type="text" placeholder="Search by name..." className="search-bar" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        <select className="sort-dropdown" value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                            <option value="">Sort By</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="name-asc">Name: A-Z</option>
                            <option value="name-desc">Name: Z-A</option>
                        </select>
                    </div>

                    {loading ? (
                        <div className="loading-spinner">Loading Products...</div>
                    ) : (
                        <div className="product-grid">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((p) => (
                                    <div key={p.id} className="product-card">
                                        <div className="product-image-container" onClick={() => setSelectedProduct(p)}>
                                            <img src={p.image_url || 'https://via.placeholder.com/300'} alt={p.name} />
                                        </div>
                                        <div className="product-details">
                                            <p className="product-brand">{p.brand}</p>
                                            <h3 className="product-name">{p.name}</h3>
                                        </div>
                                        <div className="product-footer">
                                            <span className="price">₹{p.price}</span>
                                            <button className="add-to-cart-btn" onClick={() => handleAddToCart(p)} title="Add to Cart">
                                                <ShoppingCart size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-products">
                                    <h3>No products found</h3>
                                    <p>Try adjusting your filters to see our full collection.</p>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            {/* --- Modal --- */}
            {selectedProduct && (
                <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => setSelectedProduct(null)}><X size={20} /></button>
                        <div className="modal-content">
                            <img src={selectedProduct.image_url || 'https://via.placeholder.com/400'} alt={selectedProduct.name} />
                            <div className="modal-details">
                                <p className="product-brand">{selectedProduct.brand}</p>
                                <h2>{selectedProduct.name}</h2>
                                <p><strong>Style:</strong> {selectedProduct.style}</p>
                                <p className="modal-price">₹{selectedProduct.price}</p>
                                <button className="modal-add-to-cart-btn" onClick={() => { handleAddToCart(selectedProduct); setSelectedProduct(null); }}>
                                    <ShoppingCart size={20} /> Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Notification message={notification.message} show={notification.show} />
        </div>
    );
}