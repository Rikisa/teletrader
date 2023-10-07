import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import { cyan } from '@mui/material/colors';
import { fetchCurrencyDetails } from '../utils/axios';

function CurrencyPairDetails({ authenticated }) {
  const { symbol } = useParams(); // Get the symbol parameter from the URL

  const [isInFavorites, setIsInFavorites] = useState(false);
  const [currencyDetails, setCurrencyDetails] = useState(null);

  useEffect(() => {
    // Fetch currency details when the URL parameter (symbol) changes
    if (symbol) {
      fetchCurrencyDetails(symbol)
        .then((details) => {
          setCurrencyDetails(details);
        })
        .catch((error) => {
          console.error('Error fetching currency details:', error);
        });
    }
  }, [symbol]);

  useEffect(() => {
    const existingFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const isAlreadyInFavorites = existingFavorites.some(
      (favorite) => favorite.pair === symbol
    );
    setIsInFavorites(isAlreadyInFavorites);
  }, [currencyDetails]);

  const addToFavorites = () => {
    const favoriteItem = {
      pair: symbol,
      details: currencyDetails,
    };

    const existingFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    existingFavorites.push(favoriteItem);

    localStorage.setItem("favorites", JSON.stringify(existingFavorites));

    setIsInFavorites(true);
  };

  const removeFromFavorites = () => {
    const existingFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const updatedFavorites = existingFavorites.filter(
      (favorite) => favorite.pair !== symbol
    );

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

    setIsInFavorites(false);
  };

  return (
    <>
      {/* Render the CurrencyPairDetails content here */}
      {currencyDetails && (
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
              <TableRow
                key={symbol}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell  component="th" scope="row">{symbol}</TableCell>
                <TableCell align="right">{currencyDetails.last_price}</TableCell>
                <TableCell align="right">{currencyDetails.high}</TableCell>
                <TableCell align="right">{currencyDetails.low}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Render the add/remove from favorites buttons here */}
      {authenticated && (
        <div>
          {isInFavorites ? (
            <Button
              variant="contained"
              sx={{
                bgcolor: 'red',
                ":hover": { bgcolor: 'red' },
                fontWeight: "bold",
                borderRadius: 0,
                px: 3,
                my: 2,
                textTransform: "none",
              }}
              onClick={removeFromFavorites}
            >
              Remove from favorites
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{
                bgcolor: cyan[600],
                ":hover": { bgcolor: cyan[800] },
                fontWeight: "bold",
                borderRadius: 0,
                px: 3,
                my: 2,
                border: 1,
                borderColor: "black",
                textTransform: "none",
              }}
              onClick={addToFavorites}
            >
              Add to favorites
            </Button>
          )}
        </div>
      )}
    </>
  );
}

export default CurrencyPairDetails;
