const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const moment = require('moment');
const mongoose = require('mongoose');
require('dotenv').config();
const cors =  require('cors')

// Basic Initalisation
const app = express();

const PORT = process.env.PORT || 3002;

app.use(cookieParser());

// Routes


// Database connection - Connect to MongoDB Atlas
 

// Middlewares 
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS Settings
const corsOptions = {
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow credentials (if needed)
};

app.use(cors(corsOptions));
const routes = require('./routes/index.js');
app.use('/', routes);

const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas: ', error);
  });

// File storage
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// App Start
app.listen(PORT, (error) => {
  if (!error)
    console.log("Server is Successfully Running, on http://localhost:" + PORT);
  else
    console.log("Error occurred, server can't start", error);
});