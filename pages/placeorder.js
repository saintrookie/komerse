import React, { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Button, Card, CircularProgress, Grid, Link, List, ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Layout from '../components/Layout';
import NextLink from 'next/link';
import { Store } from '../utils/store';
import Image from 'next/image';
import { useRouter } from 'next/router';
import useStyles from '../utils/styles';
import CheckoutWizard from '../components/CheckoutWizard';
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie';
import axios from 'axios';
import { getError } from '../utils/error';

function placeOrder(){
    const router = useRouter();
    const { state, dispatch } = useContext(Store);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { userInfo, cart: { cartItems, shippingAddress, paymentMethod }, } = state;
    const classes = useStyles();
    useEffect(() => {
        if(!paymentMethod){
            router.push('/payment');
        }
        if(cartItems.lenght === 0){
            router.push('/cart');
        }
    }, []);

    const round2 = (num) => Math.round(num*100 + Number.EPSILON) / 100;

    const itemsPrice = round2(cartItems.reduce((a, c) => a + c.price * c.quantity, 0));
    const shippingPrice = itemsPrice > 200 ? 0 : 15;
    const taxPrice = round2(itemsPrice * 0.15);
    const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
    const [loading, setLoading] = useState(false);
    
    const placeOrderHandler = async() => {
        closeSnackbar();
        try {
            setLoading(true);
            const { data } = await axios.post('/api/orders', {
                orderItems: cartItems,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice
            }, {
                headers: {
                    'Authorization': `Bearer ${userInfo.token}`,
                }
            });
            dispatch({type: 'CART_CLEAR' });
            Cookies.remove('cartItems');
            setLoading(false);
            enqueueSnackbar('Your Order Successfully Added', {variant: 'success'});
            router.push(`/order/${data._id}`);
        } catch(err){
            setLoading(false);
            enqueueSnackbar(getError(err), { variant: 'error' });
        }
    }
    return (
        <Layout title="Place Order">
            <CheckoutWizard activeStep={3}></CheckoutWizard>
            <Typography component="h1" variant="h1">Place Order</Typography>
            <Grid container spacing={1}>
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
                                            {cartItems.map((item) => (
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
                            <ListItem>
                                <Button onClick={placeOrderHandler} variant="contained" color="secondary" fullWidth>Place Order</Button>
                            </ListItem>
                            {loading && <ListItem><CircularProgress /></ListItem>}
                        </List>
                    </Card>
                </Grid>
            </Grid>
        </Layout>
    )
    
}


export default dynamic(() => Promise.resolve(placeOrder), {ssr: false});