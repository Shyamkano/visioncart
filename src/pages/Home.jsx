import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { ShoppingBag, Calendar, ShoppingCart, Sparkle, EyeIcon } from "lucide-react";
import img1 from "../assets/glasses/img1.png";
import video from "../assets/Cinematic_Eyewear_Video_Generation.mp4";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data || []);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="homepage">


      {/* Hero Section */}
      <section className="hero">
        <video autoPlay loop muted className="video-background">
          <source src={video} type="video/mp4" />
        </video>
        <div className="hero-text fade-in">
          <h2>
            Experience Vision, Redefined.
          </h2>
          <p>
            Step into the future of eyewear with VisionCart, where cutting-edge technology meets timeless style. Discover frames that are not just worn, but experienced.
          </p>
          <div className="hero-buttons">
            <button className="primary-btn" onClick={() => navigate('/ai-frames')}>
              <Sparkle size={18} /> Explore AI Features
            </button>
            <button className="secondary-btn" onClick={() => navigate('/shop')}>
              <ShoppingBag size={18} /> Shop the Collection
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products">
        <h2 className="section-title">Featured Products</h2>
        <div className="product-grid">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <img src={product.image_url} alt={product.name} />
              <h3>{product.name}</h3>
              <p>₹{product.price}</p>
              <button
                className="primary-btn"
                onClick={async () => {
                  try {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (!session?.user) {
                      alert("Please log in to add items to your cart.");
                      return;
                    }
                    const { error } = await supabase.from('cart').upsert(
                      { user_id: session.user.id, product_id: product.id, quantity: 1 },
                      { onConflict: 'user_id, product_id' }
                    );
                    if (error) alert(`Error: Could not add ${product.name} to cart.`);
                    else alert(`${product.name} added to cart!`);
                  } catch (e) {
                    alert("An error occurred");
                  }
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
