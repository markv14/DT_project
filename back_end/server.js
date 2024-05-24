// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/api/components', (req, res) => {
    const sql = 'SELECT * FROM components';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ components: rows });
    });
});

app.post('/api/components', (req, res) => {
    const { component_id, component_name, quantity } = req.body;
    const sql = 'INSERT INTO components (component_id, component_name, quantity) VALUES (?, ?, ?)';
    const params = [component_id, component_name, quantity];
    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID });
    });
});

app.delete('/api/components/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM components WHERE id = ?';
    db.run(sql, id, (err) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: 'Deleted successfully' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
