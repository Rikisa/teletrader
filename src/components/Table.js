import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { cyan } from "@mui/material/colors";
import { Box } from '@mui/material';

export default function HomeTable({ initialTickerData }) {

    // Initialize the ticker data state with the initial data
    const [tickerData, setTickerData] = useState(initialTickerData);

    const navigate = useNavigate();

    // Use useEffect to update the ticker data when it changes
    useEffect(() => {
            setTickerData(initialTickerData);
    }, [initialTickerData]);

    const handleCurrencyClick = (symbol) => {
        // Navigate to the CurrencyPairDetails route with the selected symbol
        navigate(`/currency/${symbol}`);
      };

    return (
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
            <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Last</TableCell>
                <TableCell align="right">Change</TableCell>
                <TableCell align="right">ChangePercent</TableCell>
                <TableCell align="right">High</TableCell>
                <TableCell align="right">Low</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {tickerData?.map((ticker) => (
                <TableRow
                    key={ticker.name} // Use a unique identifier from your data as the key
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell  component="th" 
                                scope="row"
                                sx={{color: cyan[600], fontWeight: 'bold',  }} 
                                onClick={() => handleCurrencyClick(ticker.name)}>
                        <Box sx={{cursor: 'pointer'}}>{ticker.name}</Box>
                    </TableCell>
                    <TableCell align="right">{ticker.last}</TableCell>
                    <TableCell align="right">{ticker.change}</TableCell>
                    <TableCell align="right">{ticker.changePercent}%</TableCell>
                    <TableCell align="right">{ticker.high}</TableCell>
                    <TableCell align="right">{ticker.low}</TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
        </TableContainer>
    );
}
