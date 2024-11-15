//const dotenv = require('dotenv');
/*dotenv.config();  // Load the .env file

const mongoose = require('mongoose');

// Use the MONGO_URI from the .env file to connect to the database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.log('Error connecting to MongoDB:', err);
});*/

// Use JWT_SECRET for signing JWT tokens
//const jwtSecret = process.env.JWT_SECRET;
//console.log(jwtSecret);  // You can now use this in your JWT creation logic



const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');

dotenv.config();  // Load environment variables from .env file
connectDB();  // Connect to MongoDB

const app = express();

app.use(express.json());  // Parse JSON data from requests

// Authentication routes
app.use('/api/auth', authRoutes);

// Car-related routes
app.use('/api', carRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
