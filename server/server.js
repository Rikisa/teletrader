const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const WebSocket = require('ws');
const axios = require('axios');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000', // Frontend's URL
    methods: ['GET', 'POST'],
  },
});

// Enable CORS for all routes
app.use(cors());


app.get('/currency/:symbol', async (req, res) => {
  const { symbol } = req.params;

  try {
    const response = await axios.get(`https://api.bitfinex.com/v1/pubticker/${symbol}`);
    const currencyDetails = response.data;

    res.json(currencyDetails);
  } catch (error) {
    console.error('Error fetching currency details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Initialize an object to store ticker data for all currency pairs
const allTickerData = {};

async function fetchCurrencyPairs() {
  try {
    const response = await axios.get('https://api.bitfinex.com/v1/symbols');

    // Extract the first five pairs
    const pairs = response.data.slice(0, 5);

    return pairs.join(','); // Convert the pairs to a comma-separated string
  } catch (error) {
    console.error('Error fetching currency pairs:', error);
    throw error;
  }
}

// Function to format numbers with two decimal places without unnecessary zeros
function formatNumberWithTwoDecimals(number) {
  const formattedNumber = number.toFixed(2);
  const trimmedNumber = parseFloat(formattedNumber);
  return trimmedNumber.toString();
}

io.on('connection', async (socket) => {
  console.log('Client connected');
  
  try {
    // Fetch the first five currency pairs
    const currencyPairs = await fetchCurrencyPairs();

    // Establish a WebSocket connection to the Bitfinex API
    const bitfinexSocket = new WebSocket('wss://api-pub.bitfinex.com/ws/2');

    bitfinexSocket.onopen = async () => {
      console.log('Connected to Bitfinex WebSocket');
    
      // Fetch the first five currency pairs
      const currencyPairs = await fetchCurrencyPairs();
    
      // Split the currency pairs into an array
      const pairsArray = currencyPairs.split(',');
    
      // Create a Map to store WebSocket connections for each pair
      const pairSockets = new Map();
    
      // Subscribe to each currency pair one by one
      pairsArray.forEach((pair) => {
        const pairName = pair.trim().toUpperCase();
        const formattedPair = 't' + pair.trim().toUpperCase();
    
        // Create a new WebSocket connection for this pair
        const pairSocket = new WebSocket('wss://api-pub.bitfinex.com/ws/2');
        pairSocket.onopen = () => {
    
          // Subscribe to the ticker channel for this pair
          const channelData = {
            event: 'subscribe',
            channel: 'ticker',
            symbol: formattedPair,
          };
          pairSocket.send(JSON.stringify(channelData));
        };
    
        pairSocket.onmessage = (event) => {
          const data = JSON.parse(event.data);

          // Check if it's a ticker update
          if (Array.isArray(data) && Array.isArray(data[1])) {
            const channelId = data[0]; // Channel identifier
            const tickerData = data[1]; // Ticker data array
    
            // Extract specific fields
            const id = channelId;
            const name = pairName;
            const last = formatNumberWithTwoDecimals(tickerData[6]); // LAST_PRICE
            const change = formatNumberWithTwoDecimals(tickerData[4]); // DAILY_CHANGE
            const changePercent = formatNumberWithTwoDecimals(tickerData[5]); // DAILY_CHANGE_RELATIVE
            const high = formatNumberWithTwoDecimals(tickerData[8]); // HIGH
            const low = formatNumberWithTwoDecimals(tickerData[9]); // LOW
    
            // Create an object to store ticker data for this update
            const tickerUpdate = {
              id,
              name,
              last,
              change,
              changePercent,
              high,
              low,
            };
            
             // Update the allTickerData object with the data for this pair
             allTickerData[formattedPair] = tickerUpdate;

            // Send the extracted data to the connected frontend
            io.emit('allTickerData', allTickerData);
          }
        };
    
        // Store the WebSocket connection in the Map
        pairSockets.set(formattedPair, pairSocket);
      });
    };
    
      
    bitfinexSocket.onclose = (event) => {
      console.log('Bitfinex WebSocket closed', event.code, event.reason);
      socket.disconnect();
    };

    socket.on('disconnect', () => {
      console.log('Client disconnected');
      bitfinexSocket.close();
    });
  } catch (error) {
    console.error('Error handling WebSocket connection:', error);
    socket.disconnect();
  }
});

server.listen(4000, () => {
  console.log('Server is running on port 4000');
});
