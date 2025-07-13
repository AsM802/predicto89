const axios = require('axios');

const createMarket = async () => {
  try {
    const marketData = {
      title: "Will Bitcoin reach $100,000 by 2025?",
      description: "This market predicts if Bitcoin's price will hit $100,000 by the end of 2025.",
      outcomeType: "YES_NO",
      outcomes: [{ name: "Yes" }, { name: "No" }],
      expiryDate: "2025-12-31T23:59:59Z",
      creator: "60d5ec49f8c7d00015f8e1a1", // Dummy User ID
      initialLiquidity: 1000,
    };

    const response = await axios.post('http://localhost:5001/api/markets', marketData);
    console.log('Market created successfully:', response.data);
  } catch (error) {
    console.error('Error creating market:', error.response ? error.response.data : error.message);
  }
};

createMarket();
