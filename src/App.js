import {React, useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppBar from './components/AppBar';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import CurrencyPairDetails from './components/CurrencyPairDetails';


function App() {

  // Initialize the authentication state from localStorage, if available
  const [authenticated, setAuthenticated] = useState(
    localStorage.getItem('authenticated') === 'true'
  );
  
  // Update localStorage whenever the authentication state changes
  useEffect(() => {
    localStorage.setItem('authenticated', authenticated);
  }, [authenticated]);

  const isUserAuthenticated = () => {
    return authenticated;
  };

  return (
    <Router>
      <AppBar authenticated={authenticated} setAuthenticated={setAuthenticated} />
      <Routes>
        {/* Define your routes */}
        <Route path='/' exact element={<Home />}/>
        {isUserAuthenticated() ? (
          <Route path="/favorites" element={<Favorites />} />
        ) : (
          <Route path="/favorites" element={<Navigate to="/" />} />
        )}
        <Route path='/currency/:symbol' element={<CurrencyPairDetails authenticated={authenticated}/>}/>
      </Routes>
    </Router>
  );
}

export default App;
