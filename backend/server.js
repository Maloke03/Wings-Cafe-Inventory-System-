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
    console.log('Connected to the MySQL database  ' + db.threadId);
});

let users = []; 

// Signup Route (Add User)
app.post('/api/users/signup', (req, res) => {
    const { username, password } = req.body;
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists.' });
    }
    const newUser = { username, password };
    users.push(newUser);
    res.status(201).json({ message: 'User registered successfully', user: newUser });
});

// Login Route
app.post('/api/users/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        return res.status(200).json({ message: 'Login successful', user });
    }
    res.status(400).json({ message: 'Invalid username or password.' });
});

// Update User Route
app.put('/api/users/update', (req, res) => {
    const { username, password, newUsername, newPassword } = req.body;
    const userIndex = users.findIndex(u => u.username === username && u.password === password);
    if (userIndex === -1) {
        return res.status(400).json({ message: 'User not found.' });
    }
    users[userIndex] = { username: newUsername, password: newPassword };
    res.status(200).json({ message: 'User updated successfully', user: users[userIndex] });
});

// Delete User Route
app.delete('/api/users/:username', (req, res) => {
    const { username } = req.params;
    users = users.filter(u => u.username !== username);
    res.status(200).json({ message: 'User deleted successfully' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
