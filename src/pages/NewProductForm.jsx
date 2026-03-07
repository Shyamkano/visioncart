import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const NewProductForm = ({ onProductAdded }) => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [style, setStyle] = useState('');
  const [price, setPrice] = useState('');
  const [rating, setRating] = useState('');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !image) {
      alert('Please fill in all fields and select an image.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Upload image to Supabase Storage
      const fileExt = image.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, image);

      if (uploadError) throw uploadError;

      // 2. Get public URL of the uploaded image
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      // 3. Create new product in the database
      const { data: productData, error: productError } = await supabase
        .from('products')
        .insert([
          {
            name,
            brand,
            style,
            price: parseFloat(price),
            rating: parseFloat(rating),
            image_url: urlData.publicUrl,
          },
        ]);

      if (productError) throw productError;

      alert('Product added successfully!');
      onProductAdded(); // Callback to refresh the product list
    } catch (error) {
      console.error("Error adding product:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="new-product-form">
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
      <input type="text" placeholder="Style" value={style} onChange={(e) => setStyle(e.target.value)} />
      <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
      <input type="number" placeholder="Rating" value={rating} onChange={(e) => setRating(e.target.value)} />
      <input type="file" onChange={handleImageChange} accept="image/*" />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add Product'}
      </button>
    </form>
  );
};

export default NewProductForm;
