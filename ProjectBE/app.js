const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect DB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use('/api', require('./routes/routes'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/eventRoutes'));

app.get('/api/users', (req, res) => {
  const users = [
    { id: 1, name: 'Abithan', email: 'abithan@example.com' },
    { id: 2, name: 'Sandhiya', email: 'sandhiya@example.com' },
  ];
  res.json(users);
});


module.exports = app;

