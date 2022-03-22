import React, { useContext, useEffect, useReducer, useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CircularProgress, Grid, Link, List, ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Layout from '../../components/Layout';
import NextLink from 'next/link';
import { Store } from '../../utils/store';
import Image from 'next/image';
import { useRouter } from 'next/router';
import useStyles from '../../utils/styles';
import CheckoutWizard from '../../components/CheckoutWizard';
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie';
import axios from 'axios';
import { getError } from '../../utils/error';

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST': {
            return { ...state, loading: true, error: ''  };
        }
        case 'FETCH_SUCCESS': {
            return { ...state, loading: false, order: action.payload, error: ''  };
        }
        case 'FETCH_FAIL': {
            return { ...state, loading: false, order: action.payload  };
           
        }
        default: state;
    }
}

function Order({params}){
    const orderId = params.id;
    const router = useRouter();
    const { state } = useContext(Store);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { userInfo } = state;
    const classes = useStyles();
    const [{ loading, error, order}, dispatch] = useReducer(reducer, {
        loading: true, 
        order: {}, 
        error: ''
    });
    const {shippingAddress, paymentMethod, orderItems, itemsPrice, taxPrice, shippingPrice, totalPrice} = order;
    useEffect(() => {
        if(!userInfo){
           return router.push('/login');
        }
        const fetchOrder = async () => {
            try {
                dispatch({type:'FETCH_REQUEST'});
                const { data } = await axios.get(`/api/orders/${orderId}`,  { 
                    headers: { 'Authorization': `Bearer ${userInfo.token}` },
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({ type:'FETCH_FAIL', payload: getError(err)});
            }
        };
        if(!order._id || (order._id && order._id !== orderId)){
            fetchOrder();
        }
    });


    
    return (
        <Layout title={`Order ${orderId}`}>
            <CheckoutWizard activeStep={3}></CheckoutWizard>
            <Typography component="h1" variant="h1">Order {orderId}</Typography>
            {loading ? (<CircularProgress />)
                : error ? <Typography className={classes.error}>{error}</Typography>
                :   ( <Grid container spacing={1}>
                        <Grid item md={9} xs={12}>
                            <Card variant="outlined" className={classes.section}>
                                <List>
                                    <ListItem>
                                        <Typography component="h5" variant="h5">Shipping Address</Typography>
                                    </ListItem>
                                    <ListItem>
                                        {shippingAddress.fullName}, {shippingAddress.address}, {' '}
                                        {shippingAddress.city}, {shippingAddress.postalCode}, {' '}
                                        {shippingAddress.country}
                                    </ListItem>
                                </List>
                            </Card>
                            <Card variant="outlined" className={classes.section}>
                                <List>
                                    <ListItem>
                                        <Typography component="h5" variant="h5">Payment Method</Typography>
                                    </ListItem>
                                    <ListItem>
                                        {paymentMethod}
                                    </ListItem>
                                </List>
                            </Card>
                            <Card variant="outlined" className={classes.section}>
                                <List>
                                    <ListItem>
                                        <Typography component="h5" variant="h5">Order Items</Typography>
                                    </ListItem>
                                    <ListItem>
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Image</TableCell>
                                                        <TableCell>Name</TableCell>
                                                        <TableCell align="right">Quantity</TableCell>
                                                        <TableCell align="right">Price</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {orderItems.map((item) => (
                                                        <TableRow key={item._id}>
                                                            <TableCell>
                                                                <NextLink href={`/product/${item.slug}`} passHref>
                                                                    <Link>
                                                                        <Image src={item.image} alt={item.name} width={50} height={65} />
                                                                    </Link>
                                                                </NextLink>
                                                            </TableCell>
                                                            <TableCell>
                                                                <NextLink href={`/product/${item.slug}`} passHref>
                                                                    <Link>
                                                                        <Typography>{item.name}</Typography>
                                                                    </Link>
                                                                </NextLink>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                            <Typography>{item.quantity}</Typography>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <Typography>Rp {item.price} K</Typography> 
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </ListItem>
                                </List>
                            </Card>
                        </Grid>
                        <Grid item md={3} xs={12}>
                            <Card variant="outlined" className={classes.section}>
                                <List>
                                    <ListItem>
                                        <Typography component="h5" variant="h5">
                                            Order Summary
                                        </Typography>
                                    </ListItem>
                                    <ListItem>
                                        <Grid container>
                                            <Grid item xs={6}>
                                                <Typography>Items:</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography align="right">Rp {itemsPrice} K</Typography>
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                    <ListItem>
                                        <Grid container>
                                            <Grid item xs={6}>
                                                <Typography>Tax:</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography align="right">Rp {taxPrice} K</Typography>
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                    <ListItem>
                                        <Grid container>
                                            <Grid item xs={6}>
                                                <Typography>Shipping:</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography align="right">Rp {shippingPrice} K</Typography>
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                    <ListItem>
                                        <Grid container>
                                            <Grid item xs={6}>
                                                <Typography>Total:</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography align="right"><strong> Rp {totalPrice} K</strong></Typography>
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                
                                </List>
                            </Card>
                        </Grid>
                    </Grid>
                )
            }
        </Layout>
    )
    
}

export async function getServerSideProps({ params }){
    return { props: { params } };
}

export default dynamic(() => Promise.resolve(Order), {ssr: false});