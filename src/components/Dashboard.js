import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

function Dashboard({ showNotification }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const imageRef = useRef(0);
    
    // Wrap images in useMemo to prevent unnecessary re-renders
    const images = useMemo(() => [
        '/path/to/image1.jpg',
        '/path/to/image2.jpg',
        '/path/to/image3.jpg'
    ], []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/products');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                showNotification('Error fetching products.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();

        const rotateImages = setInterval(() => {
            imageRef.current = (imageRef.current + 1) % images.length;
            document.getElementById('rotating-image').src = images[imageRef.current];
        }, 3000); 

        return () => clearInterval(rotateImages); 
    }, [images, showNotification]);

    const totalProducts = products.length;
    const lowStockCount = products.filter(product => product.quantity < 5).length;
    const averageQuantity =
        totalProducts > 0
            ? products.reduce((sum, product) => sum + product.quantity, 0) / totalProducts
            : 0;

    const chartData = {
        labels: products.map(product => product.name),
        datasets: [
            {
                label: 'Stock Levels',
                data: products.map(product => product.quantity),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
        ],
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="dashboard">
            <h2>Product Statistics</h2>
            <form>
                <div>
                    <label><strong>Total Products:</strong></label>
                    <input type="text" value={totalProducts} readOnly />
                </div>
                <div>
                    <label><strong>Low Stock Items:</strong></label>
                    <input type="text" value={lowStockCount} readOnly />
                </div>
                <div>
                    <label><strong>Average Stock Quantity:</strong></label>
                    <input type="text" value={averageQuantity.toFixed(2)} readOnly />
                </div>
            </form>
            
            <div className="chart-container">
                <h3>Current Stock Levels</h3>
                <Bar data={chartData} />
            </div>

            <div className="rotating-images">
                <h3>Product Highlights</h3>
                <img id="rotating-image" src={images[0]} alt="Product" />
            </div>
        </div>
    );
}

export default Dashboard;