const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Create a connection to the database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'Wings_cafe_inventory'
});

// Test the MySQL connection
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the MySQL database ' + db.threadId);
});

// Get all users
app.get('/api/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching users.' });
        res.status(200).json(results);
    });
});

// Signup Route (Add User)
app.post('/api/users/signup', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error checking for user.' });
        if (results.length > 0) {
            return res.status(400).json({ message: 'User already exists.' });
        }
        db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err, result) => {
            if (err) return res.status(500).json({ message: 'Error registering user.' });
            res.status(201).json({ message: 'User registered successfully', user: { username, password } });
        });
    });
});

// Login Route
app.post('/api/users/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error logging in.' });
        if (results.length > 0) {
            return res.status(200).json({ message: 'Login successful', user: results[0] });
        }
        res.status(400).json({ message: 'Invalid username or password.' });
    });
});

// Update User Route
app.put('/api/users/update', (req, res) => {
    const { username, password, newUsername, newPassword } = req.body;
    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error finding user.' });
        if (results.length === 0) {
            return res.status(400).json({ message: 'User not found.' });
        }
        db.query('UPDATE users SET username = ?, password = ? WHERE username = ?', [newUsername, newPassword, username], (err, result) => {
            if (err) return res.status(500).json({ message: 'Error updating user.' });
            res.status(200).json({ message: 'User updated successfully', user: { username: newUsername, password: newPassword } });
        });
    });
});

// Delete User Route
app.delete('/api/users/:username', (req, res) => {
    const { username } = req.params;
    db.query('DELETE FROM users WHERE username = ?', [username], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error deleting user.' });
        res.status(200).json({ message: 'User deleted successfully' });
    });
});


// Get all products
app.get('/api/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching products.' });
        res.status(200).json(results);
    });
});

// Add new product
app.post('/api/products', (req, res) => {
    const { name, description, category, price, quantity } = req.body;
    db.query('INSERT INTO products (name, description, category, price, quantity) VALUES (?, ?, ?, ?, ?)', 
        [name, description, category, price, quantity], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error adding product.' });
            }
            res.status(201).json({ message: 'Product added successfully.' });
        });
});

// Update product route in your server.js
app.put('/api/products/:name', (req, res) => {
    const { name } = req.params;
    const { description, category, price, quantity } = req.body;
    db.query('UPDATE products SET description = ?, category = ?, price = ?, quantity = ? WHERE name = ?', 
        [description, category, price, quantity, name], (err, result) => {
            if (err) return res.status(500).json({ message: 'Error updating product.' });
            res.status(200).json({ message: 'Product updated successfully.' });
    });
});

// Delete Product Route
app.delete('/api/products/:name', (req, res) => {
    const { name } = req.params;
    db.query('DELETE FROM products WHERE name = ?', [name], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error deleting product.' });
        res.status(200).json({ message: 'Product deleted successfully' });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});