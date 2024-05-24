// database.js
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = './warehouse.db';

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        db.run(`CREATE TABLE IF NOT EXISTS components (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            component_id TEXT,
            component_name TEXT,
            quantity INTEGER
        )`, (err) => {
            if (err) {
                console.error('Error creating table', err);
            }
        });
    }
});

module.exports = db;
