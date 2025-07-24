const axios = require('axios');

const createMarket = async () => {
  try {
    const marketData = {
      question: "Will AI surpass human intelligence by 2030?",
      category: "Tech",
      endTimestamp: Date.now() + (86400 * 5 * 1000), // 5 days from now
      outcomes: ["Yes", "No", "Maybe"]
    };

    const response = await axios.post('http://localhost:5002/markets', marketData);
    console.log('Market created successfully:', response.data);
  } catch (error) {
    console.error('Error creating market:', error);
  }
};

createMarket();
