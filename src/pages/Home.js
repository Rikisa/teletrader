import React, { useEffect, useState } from 'react';
import HomeTable from '../components/Table';
import io from 'socket.io-client';

const SERVER_URL = 'http://localhost:4000'; // Should use .env

function Home( ) { 
  const [tickerData, setTickerData] = useState([]);

  // Function to clear localStorage when tab is closed
  const handleTabClosing = () => {
    localStorage.clear();
  };

  useEffect(() => {
    const socket = io(SERVER_URL);
    
    socket.on('allTickerData', (data) => {

       // Convert the received object into an array of ticker data objects
       const tickerArray = Object.values(data);

       // Add an event listener to handle tab closing
      window.addEventListener('beforeunload', handleTabClosing);

      // Update the tickerData state with the received data
      setTickerData(tickerArray);
    });

    return () => {
      socket.disconnect();
       // Remove the event listener when the component is unmounted
       window.removeEventListener('beforeunload', handleTabClosing);
    };
  }, []);
 
  return (
    <div>
      <br />
      <HomeTable initialTickerData={tickerData} />
    </div>
  );
}

export default Home;
