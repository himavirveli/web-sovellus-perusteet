const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;
const cors = require('cors');
app.use(cors());

// Parse JSON bodies
app.use(express.json());


// Database setup
let db = new sqlite3.Database(path.join(__dirname, '../car-performance.db'), (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});


// API route for adding parts
app.post('/api/parts', (req, res) => {
  console.log(req.body);  // Log the body for debugging
  const { category, name, price, power, emissions, handling } = req.body;

  const sql = 'INSERT INTO parts (category, name, price, power, emissions, handling) VALUES (?, ?, ?, ?, ?, ?)';
  const params = [category, name, price, power, emissions, handling];

  db.run(sql, params, function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: 'Part added', part_id: this.lastID });
  });
});

// API route for fetching car stats
app.get('/api/car', (req, res) => {
  console.log("API request received: /api/car");
  const sql = 'SELECT power, emissions, handling FROM car WHERE id = ?';
  const carId = 1;

  db.get(sql, [carId], (err, row) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.json(row);
  });
});

// API route for fetching all parts
app.get('/api/parts', (req, res) => {
  console.log("API request received: /api/parts");
  const sql = 'SELECT * FROM parts';
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({
      message: 'Success',
      data: rows
    });
  });
});

// Serve static files after API routes
app.use(express.static(path.join(__dirname, '../public')));

// Catch-all route to serve index.html for any other requests
// This route MUST be last to ensure it doesn't interfere with API routes.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
