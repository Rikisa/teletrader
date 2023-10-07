import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { cyan } from '@mui/material/colors';

function Favorites() {  
  const [favorites, setFavorites] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the favorites from local storage
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  const handleCurrencyClick = (symbol) => {
    // Navigate to the CurrencyPairDetails route with the selected symbol
    navigate(`/currency/${symbol}`);
  };

  return (
    <>
    <br />
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
                <TableRow>
                <TableCell>Symbol</TableCell>
                <TableCell align="right">Last price</TableCell>
                <TableCell align="right">High</TableCell>
                <TableCell align="right">Low</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {favorites.map((currency) => (
                <TableRow
                    key={currency.pair} // Use a unique identifier from your data as the key
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell 
                        component="th" 
                        scope="row"
                        sx={{color: cyan[600], fontWeight: 'bold'}}
                        onClick={() => handleCurrencyClick(currency.pair)} 
                        style={{ cursor: 'pointer'}}
                    >
                    {currency.pair}
                    </TableCell>
                    <TableCell align="right">{currency.details.last_price}</TableCell>
                    <TableCell align="right">{currency.details.high}</TableCell>
                    <TableCell align="right">{currency.details.low}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>
    </>
  );
}

export default Favorites;
