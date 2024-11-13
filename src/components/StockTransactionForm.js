import React, { useState, useEffect } from 'react';

function StockTransactionForm({ showNotification }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantityChange, setQuantityChange] = useState('');
  const [transactionType, setTransactionType] = useState('add');

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

  const handleTransaction = async (e) => {
    e.preventDefault();

    if (!selectedProduct || !quantityChange) {
      showNotification('Please select a product and enter a quantity.');
      return;
    }

    const productIndex = products.findIndex(product => product.name === selectedProduct);
    if (productIndex === -1) {
      showNotification(`Product ${selectedProduct} not found.`);
      return;
    }

    const product = products[productIndex];
    let updatedQuantity;

    if (transactionType === 'add') {
      updatedQuantity = product.quantity + parseInt(quantityChange, 10);
      showNotification(`Added ${quantityChange} units to ${product.name}. Current quantity: ${updatedQuantity}`);
    } else if (transactionType === 'deduct') {
      updatedQuantity = product.quantity - parseInt(quantityChange, 10);
      if (updatedQuantity < 0) {
        showNotification(`Insufficient stock for ${product.name}.`);
        return;
      }
      showNotification(`Deducted ${quantityChange} units from ${product.name}. Current quantity: ${updatedQuantity}`);
    }

    // Update the product quantity in the database
    try {
      await fetch(`http://localhost:3000/api/products/${product.name}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: product.description,
          category: product.category,
          price: product.price,
          quantity: updatedQuantity,
        }),
      });
      // Update local state
      const updatedProducts = [...products];
      updatedProducts[productIndex].quantity = updatedQuantity;
      setProducts(updatedProducts);
    } catch (error) {
      showNotification('Error updating product in the database.');
    }

    setQuantityChange('');
  };

  return (
    <div className="stock-transaction">
      <h3>Record Stock Transaction</h3>
      <form onSubmit={handleTransaction}>
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option value="">Select a Product</option>
          {products.map((product, index) => (
            <option key={index} value={product.name}>
              {product.name}
            </option>
          ))}
        </select>

        <select
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
        >
          <option value="add">Add New Stock</option>
          <option value="deduct">Deduct Stock for Sale</option>
        </select>

        <input
          type="number"
          value={quantityChange}
          onChange={(e) => setQuantityChange(e.target.value)}
          placeholder="Enter quantity"
          required
        />
        
        <button type="submit">Submit Transaction</button>
      </form>
    </div>
  );
}

export default StockTransactionForm;