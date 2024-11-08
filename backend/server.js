const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;


app.use(express.json());


const db = mysql.createConnection({
    host: 'localhost',    
    user: 'root',
    password: '123456', 
    database: 'Wings_cafe_inventory'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database');
});

// API endpoint to add a new user
app.post('/api/users', (req, res) => {
    const { name, email } = req.body;
    const query = 'INSERT INTO users (name, email) VALUES (?, ?)';

    db.query(query, [name, email], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'User added successfully', userId: result.insertId });
    });
});

// API endpoint to get all users
app.get('/api/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(200).json(results);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
