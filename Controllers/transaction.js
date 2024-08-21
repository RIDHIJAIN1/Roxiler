// controllers/transactionController.js

const Transaction = require("../models/Transaction"); // Update with your actual model path

const getTransactions = async (req, res) => {
  const { month, search, page = 1, limit = 10 } = req.query;
  // Validate month input
  const validMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  if (month && !validMonths.includes(month))
    return res.status(400).send("Invalid month. Please provide a month between January and December.");
  const monthNumber = month ? validMonths.indexOf(month) + 1 : null; // Convert month name to number (1-12)
  
  try {
    // Build the aggregation pipeline
    const matchStage = {};
    if (monthNumber) {
      // Match the month of the dateOfSale
      matchStage.$expr = {
        $eq: [{ $month: "$dateOfSale" }, monthNumber]
      };
    }
    if (search) {
      // Match search text in title and description
      const searchRegex = new RegExp(search, 'i'); // Case insensitive search
      matchStage.$or = [
        { title: searchRegex },
        { description: searchRegex },
      ];
      
      // Check if the search term can be converted to a number
      const priceSearch = parseFloat(search);
      if (!isNaN(priceSearch)) {
        matchStage.$or.push({ price: priceSearch }); // Match price if it's a number
      }
    }

    const transactions = await Transaction.aggregate([
      { $match: matchStage },
      { $facet: {
          paginatedResults: [
            { $skip: (page - 1) * limit },
            { $limit: parseInt(limit) }
          ],
          totalCount: [
            { $count: "count" }
          ]
        }
      }
    ]);
    
    const totalCount = transactions[0].totalCount.length > 0 ? transactions[0].totalCount[0].count : 0;
    const totalPages = Math.ceil(totalCount / limit);
    res.json({
      totalPages,
      currentPage: page,
      transactions: transactions[0].paginatedResults
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).send("Error fetching transactions");
  }
};

const getStatistics = async (req, res) => {
  const { month } = req.query;

  // Validate month input
  const validMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthNumber = month ? validMonths.indexOf(month) + 1 : null; // Convert month name to number (1-12)

  // Build the aggregation pipeline
  const matchStage = {};
  if (monthNumber) {
    // Match the month of the dateOfSale
    matchStage.$expr = {
      $eq: [{ $month: "$dateOfSale" }, monthNumber]
    };
  }

  try {
    // Build the aggregation pipeline
    const statistics = await Transaction.aggregate([
      {
        $match: matchStage
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$price" },
          soldItems: { $sum: { $cond: [{ $eq: ["$sold", true] }, 1, 0] } },
          unsoldItems: { $sum: { $cond: [{ $eq: ["$sold", false] }, 1, 0] } }
        }
      }
    ]);

    const result = statistics[0] || {
      totalAmount: 0,
      soldItems: 0,
      unsoldItems: 0
    };

    res.json({
      totalSales: result.totalAmount,
      soldItems: result.soldItems,
      unsoldItems: result.unsoldItems,
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).send("Error fetching statistics");
  }
};


const getBarChartData = async (req, res) => {
  const { month } = req.query;

  // Validate month input
  const validMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthNumber = month ? validMonths.indexOf(month) + 1 : null; // Convert month name to number (1-12)

  // Build the aggregation pipeline
  const matchStage = {};
  if (monthNumber) {
    // Match the month of the dateOfSale
    matchStage.$expr = {
      $eq: [{ $month: "$dateOfSale" }, monthNumber]
    };
  }

  const ranges = [
    [0, 100],
    [101, 200],
    [201, 300],
    [301, 400],
    [401, 500],
    [501, 600],
    [601, 700],
    [701, 800],
    [801, 900],
    [901, Number.MAX_SAFE_INTEGER],
  ];

  try {
    const result = await Promise.all(
      ranges.map(async ([min, max]) => {
        const count = await Transaction.countDocuments({
          ...matchStage,
          price: { $gte: min, $lte: max },
        });
        return { range: `${min}-${max}`, count };
      })
    );

    res.json(result);
  } catch (err) {
    console.error("Error fetching bar chart data:", err);
    res.status(500).send("Error fetching bar chart data");
  }
};

module.exports = { getBarChartData };


const getPieChartData = async (req, res) => {
  const { month } = req.query;

  // Validate month input
  const validMonths = ['January', 'February', 'March', 'April', 'May', 'June','July', 'August', 'September', 'October', 'November', 'December'];
  const monthNumber = month ? validMonths.indexOf(month) + 1 : null; // Convert month name to number (1-12)

  // Build the aggregation pipeline
  const matchStage = {};
  if (monthNumber) {
    // Match the month of the dateOfSale
    matchStage.$expr = {
      $eq: [{ $month: "$dateOfSale" }, monthNumber]
    };
  }

  try {
    // Aggregate the transactions to get unique categories and their counts
    const categories = await Transaction.aggregate([
      {
        $match: matchStage
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Format the response
    const formattedCategories = categories.map(category => ({
      category: category._id,
      count: category.count
    }));

    res.json(formattedCategories);
  } catch (err) {
    console.error("Error fetching pie chart data:", err);
    res.status(500).send('Error fetching pie chart data');
  }
};

module.exports = {
  getTransactions,
  getStatistics,
  getBarChartData,
  getPieChartData,
};
