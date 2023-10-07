import axios from 'axios';

// Create an instance of Axios with your custom configurations if needed
const instance = axios.create({
  baseURL: 'http://localhost:4000', // Should load from .env
  // Add any other custom configurations here
});

// Define your API calls as functions
export const fetchCurrencyDetails = async (symbol) => {
  try {
    const response = await instance.get(`/currency/${symbol}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching currency details:', error);
    throw error;
  }
};
