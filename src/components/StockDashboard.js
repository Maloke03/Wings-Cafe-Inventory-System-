import React, { useState } from 'react';

function StockDashboard({ products, setProducts, showNotification }) {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editProductIndex, setEditProductIndex] = useState(null);

  const handleAddOrUpdateProduct = (e) => {
    e.preventDefault();
    const productsCopy = [...products];

    if (isEditing && editProductIndex !== null) {
      productsCopy[editProductIndex] = { name: productName, description, category, price, quantity: parseInt(quantity, 10) };
      showNotification(`${productName} updated successfully.`);

      if (parseInt(quantity, 10) < 5) {
        showNotification(`Warning: Stock for ${productName} is low (Quantity: ${quantity})`);
      }

      setIsEditing(false);
      setEditProductIndex(null);
    } else {
      const existingProduct = productsCopy.find(product => product.name.toLowerCase() === productName.toLowerCase());
      if (existingProduct) {
        showNotification(`Product ${productName} already exists.`);
        return;
      }
      productsCopy.push({ name: productName, description, category, price, quantity: parseInt(quantity, 10) });
      showNotification(`${productName} added successfully.`);

      
      if (parseInt(quantity, 10) < 5) {
        showNotification(`Warning: Stock for ${productName} is low (Quantity: ${quantity})`);
      }
    }

    setProducts(productsCopy);
    localStorage.setItem('products', JSON.stringify(productsCopy));
    resetForm();
  };

  const handleEdit = (index) => {
    const productToEdit = products[index];
    setProductName(productToEdit.name);
    setDescription(productToEdit.description);
    setCategory(productToEdit.category);
    setPrice(productToEdit.price);
    setQuantity(productToEdit.quantity);
    setIsEditing(true);
    setEditProductIndex(index);
  };

  const handleDelete = (index) => {
    const productsCopy = products.filter((_, i) => i !== index);
    setProducts(productsCopy);
    localStorage.setItem('products', JSON.stringify(productsCopy));
    showNotification(`Product deleted successfully.`);
  };

  const resetForm = () => {
    setProductName('');
    setDescription('');
    setCategory('');
    setPrice('');
    setQuantity('');
  };

  return (
    <div className="stock-dashboard">
      <h2>Stock Dashboard</h2>
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="6">No products added yet.</td>
            </tr>
          ) : (
            products.map((product, index) => (
              <tr key={index}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.category}</td>
                <td>${product.price}</td>
                <td>{product.quantity}</td>
                <td>
                  <button onClick={() => handleEdit(index)}>Edit</button>
                  <button onClick={() => handleDelete(index)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <h3>{isEditing ? 'Edit Product' : 'Add Product'}</h3>
      <form onSubmit={handleAddOrUpdateProduct}>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Product Name"
          required
          disabled={isEditing} 
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          required
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          min="0.01"
          step="0.01"
          required
        />
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Initial Quantity"
          min="0"
          required
        />
        <button type="submit">{isEditing ? 'Update Product' : 'Add Product'}</button>
      </form>
    </div>
  );
}

export default StockDashboard;
