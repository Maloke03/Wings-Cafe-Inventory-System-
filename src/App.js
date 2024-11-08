import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import './Style.css';
import StockDashboard from './components/StockDashboard';
import StockTransactionForm from './components/StockTransactionForm';
import UserManagement from './components/UserManagement';
import Notification from './components/Notification';
import Dashboard from './components/Dashboard';
import backgroundImage from './nama.webp'; 

function App() {
    const [notification, setNotification] = useState('');
    const [products, setProducts] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
        setProducts(storedProducts);
    }, []);

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(''), 3000);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    return (
        <Router>
            <div
                className="container"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '100vh',
                }}
            >
                <h1>*** Wings Cafe Inventory System ***</h1>
                <Notification message={notification} />

                {!isLoggedIn ? (
                    <UserManagement showNotification={showNotification} setIsLoggedIn={setIsLoggedIn} isLoginMode={true} />
                ) : (
                    <>
                        <nav>
                            <Link to="/dashboard">Product Management</Link>
                            <Link to="/transaction">Transaction</Link>
                            <Link to="/user-management">User Management</Link>
                            <Link to="/statistics">Dashboard</Link>
                            <button onClick={handleLogout}>Logout</button>
                        </nav>
                        <Routes>
                            <Route
                                path="/dashboard"
                                element={<StockDashboard products={products} setProducts={setProducts} showNotification={showNotification} />}
                            />
                            <Route
                                path="/transaction"
                                element={<StockTransactionForm products={products} setProducts={setProducts} showNotification={showNotification} />}
                            />
                            <Route
                                path="/user-management"
                                element={<UserManagement showNotification={showNotification} setIsLoggedIn={setIsLoggedIn} isLoginMode={false} />}
                            />
                            <Route
                                path="/statistics"
                                element={<Dashboard products={products} />}
                            />
                            <Route path="/" element={<Navigate to="/dashboard" />} />
                        </Routes>
                    </>
                )}
            </div>
        </Router>
    );
}

export default App;
