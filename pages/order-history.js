import { Button, Card, CircularProgress, Grid, List, ListItem, ListItemText, Table, TableBody, TableCell, TableContainer,TableHead,TableRow,Typography } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useReducer } from 'react';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import { Store } from '../utils/store';
import useStyles from '../utils/styles';

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST': {
            return { ...state, loading: true, error: ''  };
        }
        case 'FETCH_SUCCESS': {
            return { ...state, loading: false, orders: action.payload, error: ''  };
        }
        case 'FETCH_FAIL': {
            return { ...state, loading: false, error: action.payload  };
        }
       
        default: state;
    }
}


function OrderHistory() {
    const { state } = useContext(Store);
    const userInfo = state;
    const router = useRouter();
    const classes = useStyles();
    const [{ loading, error, orders}, dispatch] = useReducer(reducer, {
        loading: true, 
        orders: [], 
        error: ''
    });

    useEffect(() => {
        if(!userInfo){
            router.push('/login');
        }
        const fetchOrder = async () => {
            try {
                dispatch({type:'FETCH_REQUEST'});
                const { data } = await axios.get(`/api/orders/history/`,  { 
                    headers: { 'Authorization': `Bearer ${userInfo.userInfo.token}` },
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type:'FETCH_FAIL', payload: getError(err)});
            }
        };
        fetchOrder();
    }, []);
   
    return (
        <Layout title='Order History'>
            <Grid container spacing={1}>
                <Grid item md={3} xs={12}>
                    <Card variant="outlined" className={classes.section}>  
                        <List>
                            <NextLink href='/profile' passHref>
                                <ListItem button component="a">
                                    <ListItemText primary="User Profile"></ListItemText>
                                </ListItem>
                            </NextLink>
                            <NextLink href='/order-history' passHref>
                                <ListItem selected button component="a">
                                    <ListItemText primary="Order History"></ListItemText>
                                </ListItem>
                            </NextLink>
                        </List>  
                    </Card>
                </Grid>
                <Grid item md={9} xs={12}>
                    <Box><Typography component="h3" variant="h3">Order History</Typography></Box>
                    <Card variant="outlined" className={classes.section}>
                        <List>
                            <ListItem>
                                
                                {loading ? (<CircularProgress />)
                                : error ? <Typography className={classes.error}>{error}</Typography>
                                :   ( 
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>ID</TableCell>
                                                        <TableCell>DATE</TableCell>
                                                        <TableCell>TOTAL</TableCell>
                                                        <TableCell>PAY METHOD</TableCell>
                                                        <TableCell>PAID</TableCell>
                                                        <TableCell>DELIVER</TableCell>
                                                        <TableCell>ACTION</TableCell>

                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {orders.map((order) => (
                                                        <TableRow key={order._id}>
                                                            <TableCell>{order._id.substring(20, 24)}</TableCell>
                                                            <TableCell>{order.createdAt}</TableCell>
                                                            <TableCell>Rp {order.totalPrice}</TableCell>
                                                            <TableCell>{order.paymentMethod}</TableCell>
                                                            <TableCell>{order.isPaid ? `paid at ${order.paidAt}` : 'Not Paid'}</TableCell>
                                                            <TableCell>{order.isDelivered ? `paid at ${order.deliveredAt}` : 'Not Delivered'}</TableCell>
                                                            <TableCell><NextLink href={`/order/${order._id}`} passHref><Button variant="contained">Details</Button></NextLink></TableCell>

                                                            
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    )
                                }
                            </ListItem>
                        </List>
                    </Card>
                </Grid>
            </Grid>
            
            
        </Layout>
    )
}

export default dynamic(() => Promise.resolve(OrderHistory), {ssr: false});
