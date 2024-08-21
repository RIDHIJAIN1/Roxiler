const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();
const { Transaction } = require('../models');

const test = async (req, res) => {
    try {
        res.status(200).send("API is working!");
    } catch (error) {
        console.error('Error occured', error);
        res.status(500).send('Something went wrong!');
    }
};
const init = async (req, res) => {
    const MONGODB_URI = process.env.MONGODB_URI;
    const THIRD_PARTY_API_URL = process.env.THIRD_PARTY_API_URL;
    try {
        // Fetch data from the third-party API
        const response = await axios.get(THIRD_PARTY_API_URL);
        const transactions = response.data;
        // Clear existing data (optional)
        await Transaction.deleteMany({});
        // Insert the fetched data into the database
        const result = await Transaction.insertMany(transactions);
        res.status(200).send(`${result.length} transactions seeded successfully`);
    } catch (error) {
        console.error('Error seeding data:', error);
        res.status(500).send('Error initializing the database');
    }
};

module.exports = {
    test,
    init
}