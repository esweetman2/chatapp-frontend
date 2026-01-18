// import React from 'react'
import { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    CssBaseline,
    // Drawer,
    // List,
    //   ListItem,
    // ListItemButton,
    // ListItemText,
    Box,
    Button,
    // Stack,
} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
// import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router';
import { useUserContext } from '../src/Context/UserContext';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const columns = [
//         { field: 'name', headerName: 'name', width: 130 },
//         { field: 'institution_name', headerName: 'institution_name', width: 70 },
//         {
//             field: 'balances',
//             headerName: 'balances',
//             // type: 'float',
//             width: 90,
//         },
//         {
//             field: 'official_name',
//             headerName: 'official_name',
//             sortable: false,
//             width: 160,
//         },
//     ];


export default function PlaidScreen() {
    const navigate = useNavigate();
    const { user, logout, isLoggedIn } = useUserContext();
    const [accounts, setAccounts] = useState<any>([])
    const [totalBalance, setTotalBalance] = useState<any>(0)


    if (!user && isLoggedIn !== true) {
        throw new Error('AuthContext.Provider is missing in the component tree');
    }

    useEffect(() => {

        const fetchAccounts = async () => {

            try {
                const res = await fetch(`${API_BASE_URL}/plaid/accounts/?user_id=${user?.id}`)
                if (!res.ok) throw new Error("Failed to fetch user chats");
                const data = await res.json();
                // console.log("new_chats data: ", data)
                if("accounts" in data){

                    setAccounts(data["accounts"]);
                }
                if("total_balances" in data) {

                    setTotalBalance(data["total_balances"])
                }
            }
            catch (err) {
                console.error("Error fetching chats:", err);
            } finally {
                // setIsLoading(false);
                console.log("finished")
            }
        }
        fetchAccounts()
    }, [])

    // const paginationModel = { page: 0, pageSize: 5 };


    // if (accounts.length > 0) {
    //     var keep_columns = ["id", "name", "institution_name", "official_name", "balances"]
    //     accounts.forEach((obj:any) => {
    //         var keys = Object.keys(obj)
    //         // console.log(keys
    //         for (let j = 0; j < keys.length; j++) {
    //             // console.log(keys[j])
    //             if (!keep_columns.includes(keys[j])) {
    //                 delete obj[keys[j]]
    //             }
                
    //         }
    //     })
    //     var rows = accounts
    // }

    return (
        <Box
            sx={{
                display: 'flex',
                // position: "relative"
            }}
        >
            <CssBaseline />

            {/* AppBar */}
            <AppBar
                position="fixed"
                // sx={{ width: `calc(100% - ${drawerWidth}px)` }}
                sx={{ width: "100%" }}
                elevation={0}
            >
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', backgroundColor: "white", elevation: 0 }}>
                    <Typography variant="h6" noWrap component="div" sx={{ color: "black" }}>
                        {user ? `Welcome, ${user.display_name}` : 'No user logged in'}
                    </Typography>
                    <Typography variant="h6" noWrap component="div">
                        <Button onClick={() => navigate("/agent/admin")} sx={{ color: "black" }} >Admin</Button>
                    </Typography>
                    <Typography variant="h6" noWrap component="div">
                        <Button onClick={logout} sx={{ color: "black" }} >Log Out</Button>
                    </Typography>
                    <Typography variant="h6" noWrap component="div">
                        <Button onClick={() => navigate("/chat")} sx={{ color: "black" }} >Chat</Button>
                    </Typography>


                </Toolbar>
            </AppBar>
            <Box>
                <h2>$ {totalBalance}</h2>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Dessert (100g serving)</TableCell>
                                <TableCell align="right">institution_name</TableCell>
                                <TableCell align="right">name</TableCell>
                                <TableCell align="right">balances&nbsp;($)</TableCell>
                                <TableCell align="right">official_name</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {accounts.map((row: any) => (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.institution_name}</TableCell>
                                    <TableCell align="right">{row.name}</TableCell>
                                    <TableCell align="right">{row.balances}</TableCell>
                                    <TableCell align="right">{row.official_name}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {/* <Paper sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        initialState={{ pagination: { paginationModel } }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                        sx={{ border: 0 }}
                    />
                </Paper> */}
                <p>{JSON.stringify(accounts)}</p>
            </Box>
        </Box>
    )
}
