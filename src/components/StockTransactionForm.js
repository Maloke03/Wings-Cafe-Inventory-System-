import React, { useState } from 'react';

function StockTransactionForm({ products, setProducts, showNotification }) {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantityChange, setQuantityChange] = useState('');
  const [transactionType, setTransactionType] = useState('add'); 

  
  const handleTransaction = (e) => {
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

    const updatedProducts = [...products];
    const product = updatedProducts[productIndex];
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

    product.quantity = updatedQuantity;
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));

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
          <option value="deduct">Deduct Stock for sale</option>
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
