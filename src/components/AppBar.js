import React from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import { Button } from "@mui/material";
import { useNavigate, useLocation } from 'react-router-dom'; 

import { cyan, grey } from "@mui/material/colors";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


export default function MenuAppBar({ authenticated, setAuthenticated }) {

  const navigate = useNavigate();
  const location = useLocation(); 

  const handleLoginToggle = () => {
    // Toggle the authentication state
    setAuthenticated(!authenticated);
  };

  const handleHomeClick = () => {
    // Navigate to the root URL to reload the HomeTable component
    navigate('/');
   
  };

  const handleFavoritesClick = () => {
    // Navigate to the root URL to reload the HomeTable component
    navigate('/favorites');
  };

  // Conditionally apply styles based on the current location
  const isHomeActive = location.pathname === '/';
  const isFavoritesActive = location.pathname === '/favorites';

  return (
    <Box sx={{ flexGrow: 1 }}>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={authenticated}
              onChange={handleLoginToggle}
              aria-label="login switch"
            />
          }
          label={authenticated ? 'Logout' : 'Login'}
        />
      </FormGroup>
      <AppBar position="static">
        <Toolbar sx={{bgcolor: 'white', color: cyan[600]}}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1  }}>
            <Box sx={{flexDirection: "row", display: 'flex' }}>
              <Button 
                sx={{ color: isHomeActive ? cyan[600] : grey[500], ":hover":{ bgcolor: 'white'}, mr: 2, fontWeight: 'bold'}}
                onClick={handleHomeClick}>
                  Home
                </Button>

              {authenticated && 
              (<Button 
                  sx={{ color: isFavoritesActive  ? cyan[600] : grey[500], ":hover":{ bgcolor: 'white'}, fontWeight: 'bold'}}
                  onClick={handleFavoritesClick}>
                    Favorites
                  </Button>)}
            </Box>
          </Typography>
          
          {!authenticated && (
            <div>
              <Button 
                variant="contained" 
                sx={{bgcolor: cyan[600], ":hover":{ bgcolor: cyan[800]}, fontWeight: 'bold', borderRadius: 0, px: 4}}
                onClick={handleLoginToggle} 
                >Login</Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}