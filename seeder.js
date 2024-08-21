// seeder.js
const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();
const { Transaction } = require('./models');


// Database connection - Connect to MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI;
const THIRD_PARTY_API_URL = process.env.THIRD_PARTY_API_URL;

const run = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');

        // Fetch data from the third-party API
        const response = await axios.get(THIRD_PARTY_API_URL);
        const transactions = response.data;
        console.log('Fetching data from third party');

        // Clear existing data (optional)
        await Transaction.deleteMany({});
        console.log('Clear existing data');

        // Insert the fetched data into the database
        const result = await Transaction.insertMany(transactions);
        console.log(`${result.length} transactions seeded successfully`);
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        // Close the database connection after seeding is completed
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
};

run();