import React, { useState, useEffect } from 'react';

function StockDashboard({ showNotification }) {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editProductIndex, setEditProductIndex] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      showNotification('Error fetching products.');
    }
  };

  const handleAddOrUpdateProduct = async (e) => {
    e.preventDefault();
    if (!productName || !description || !category || !price || !quantity) {
      showNotification('All fields must be filled.');
      return;
    }

    const productData = {
      name: productName,
      description,
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
    };

    if (isEditing && editProductIndex !== null) {
      try {
        await fetch(`http://localhost:3000/api/products/${products[editProductIndex].name}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
        fetchProducts();
        showNotification(`${productName} updated successfully.`);
        resetForm();
      } catch (error) {
        showNotification('Error updating product.');
      }
    } else {
      const existingProduct = products.find(product => product.name.toLowerCase() === productName.toLowerCase());
      if (existingProduct) {
        showNotification(`Product ${productName} already exists.`);
        return;
      }
      try {
        await fetch('http://localhost:3000/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
        fetchProducts();
        showNotification(`${productName} added successfully.`);
        resetForm();
      } catch (error) {
        showNotification('Error adding product.');
      }
    }

    setIsEditing(false);
    setEditProductIndex(null);
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

  const handleDelete = async (index) => {
    try {
      const productToDelete = products[index];
      await fetch(`http://localhost:3000/api/products/${productToDelete.name}`, {
        method: 'DELETE',
      });
      fetchProducts();
      showNotification(`Product deleted successfully.`);
    } catch (error) {
      showNotification('Error deleting product.');
    }
  };

  const resetForm = () => {
    setProductName('');
    setDescription('');
    setCategory('');
    setPrice('');
    setQuantity('');
  };

  return (
    <div>
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