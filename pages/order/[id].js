import React, { useContext, useEffect, useReducer } from 'react';
import dynamic from 'next/dynamic';
import { Box, Card, CircularProgress, Grid, Link, List, ListItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Layout from '../../components/Layout';
import NextLink from 'next/link';
import { Store } from '../../utils/store';
import Image from 'next/image';
import { useRouter } from 'next/router';
import useStyles from '../../utils/styles';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { getError } from '../../utils/error';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

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
        case 'PAY_REQUEST': {
            return { ...state, loadingPay: true };
        }
        case 'PAY_SUCCESS': {
            return { ...state, loadingPay: false, successPay: true  };
        }
        case 'PAY_FAIL': {
            return { ...state, loadingPay: false, errorPay:action.payload  };
           
        }
        case 'PAY_RESET': {
            return { ...state, loadingPay: false, errorPay:''  };
           
        }
        default: state;
    }
}

function Order({params}){
    const orderId = params.id;
    const [{isPending}, paypalDispatch] = usePayPalScriptReducer();
    const router = useRouter();
    const { state } = useContext(Store);
    const { enqueueSnackbar } = useSnackbar();
    const { userInfo } = state;
    const classes = useStyles();
    const [{ loading, error, order, successPay}, dispatch] = useReducer(reducer, {
        loading: true, 
        order: {}, 
        error: ''
    });
    const {shippingAddress, paymentMethod, orderItems, itemsPrice, taxPrice, shippingPrice, totalPrice, isDelivered, deliveredAt, isPaid, paidAt} = order;
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
        if(!order._id || successPay || (order._id && order._id !== orderId)){
            fetchOrder();
            if(successPay){
                dispatch({type:'PAY_RESET'});
            }
        } else {
            const loadPaypalScript = async () => {
                const {data: clientId} = await axios.get('/api/keys/paypal', {
                    headers: { 'Authorization': `Bearer ${userInfo.token}` },
                });
                paypalDispatch({ type: 'resetOptions', value : {
                    'client-id' : clientId,
                    currency: 'USD',
                    } 
                });
                paypalDispatch({type:'setLoadingStatus', value: 'pending'});
            };
            loadPaypalScript();
        }
    }, [order, successPay]);

    function createOrder(data, actions){
        return actions.order.create({
            purchase_units: [
                {
                    amount: { value: totalPrice },
                }
            ]
        }).then((orderID) => {
            return orderID;
        });
    }

    function onApprove(data, actions) {
        return actions.order.capture().then(async function(details) {
            try {
                dispatch({type:'PAY_REQUEST'});
                const {data} = await axios.put(`/api/orders/${order._id}/pay`, details, {
                    headers: { 'Authorization': `Bearer ${userInfo.token}` },
                });
                dispatch({type:'PAY_SUCCESS', payload: data});
                enqueueSnackbar('Order is paid', {variant: 'success'});
            } catch(err) {
                dispatch({type:'PAY_FAIL', payload: getError(err)});
                enqueueSnackbar(getError(err), {variant: 'error'});
            }
        })
    }

    function onError(err) {
        enqueueSnackbar(getError(err), {variant: 'error'});
    }
    
    return (
        <Layout title={`Order ${orderId}`}>
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
                                    <ListItem>
                                        Status:{' '} { isDelivered
                                                ? `delivered at ${deliveredAt}`
                                                : `not delivered`}
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
                                    <ListItem>
                                        Status:{' '} { isPaid
                                                ? `paid at ${paidAt}`
                                                : `not paid`}
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
                                   
                                        {
                                            !isPaid && (
                                              
                                                    <ListItem>
                                                        <Box md={{ width: '100%' }} className={classes.fullwidth} >
                                                            {isPending? (<CircularProgress />) : 
                                                                <PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onError}></PayPalButtons>
                                                            }
                                                        </Box>
                                                    </ListItem>
                                                
                                            )
                                        }
                                    
                                    
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