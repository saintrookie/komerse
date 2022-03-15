import React, { useContext } from 'react';
import NextLink from 'next/link';
import Link from '@mui/material/Link';
import Layout from '../../components/Layout';
import useStyles from '../../utils/styles';
import { Button, Grid, List, ListItem, Typography } from '@mui/material';
import Image from 'next/image';
import db from '../../utils/db';
import Product from '../../models/Product';
import axios from 'axios';
import { Store } from '../../utils/store';
import { useRouter } from 'next/router';

export default function ProductScreen(props) {
    const router = useRouter();
    const {state, dispatch} = useContext(Store);
    const {product} = props;
    const classes = useStyles();

    if(!product){
        return <div>Product Not Found</div>
    }

    const addToCartHandler = async () => {
        const existItem = state.cart.cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1 ;
        const { data } = await axios.get(`/api/products/${product._id}`);
        if (data.countInStock < quantity) {
            window.alert('Sorry. Product is out of stock');
            return;
        }
        dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
        router.push('/cart');
    };
    

    return (
        <Layout title={product.name} description={product.description}>
            <div className={classes.section}>
                <NextLink href="/" passHref>
                    <Link>back to products</Link>
                </NextLink>
            </div>
            <Grid container spacing={1}>
                <Grid item md={4} xs={12}>
                    <Image 
                        src={product.image} 
                        alt={product.name} 
                        width={200} 
                        height={280} 
                        layout="responsive">

                    </Image>
                </Grid>
                <Grid item md={4} xs={12}>
                    <List>
                        <ListItem><Typography component="h1" variant="h1">{product.name}</Typography></ListItem>
                        <ListItem>
                            <Typography>
                                Category: {product.category}
                            </Typography>
                        </ListItem>
                        <ListItem>Brand: {product.brand}</ListItem>
                        <ListItem>Rating: {product.rating} stars ({product.numReviews} reviews)</ListItem>
                        <ListItem>Description: 
                            <Typography>
                                {product.description}
                            </Typography>
                        </ListItem>
                    </List>
                </Grid>
                <Grid item md={4} xs={12}>
                    <List>
                        <ListItem>
                            <Grid container>
                                <Grid item xs={6}>
                                    <Typography>Price</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>${product.price}</Typography>
                                </Grid>
                            </Grid>
                        </ListItem>
                        <ListItem>
                            <Grid container>
                                <Grid item xs={6}>
                                    <Typography>{product.countInStock > 0 ? 'In Stock' : 'unavailable'}</Typography>
                                </Grid>
                            </Grid>
                        </ListItem>
                        <ListItem>
                            <Button fullWidth variant="outlined" color="secondary" onClick={addToCartHandler}>Add To Cart</Button>
                        </ListItem>
                    </List>
                </Grid>
            </Grid>
        </Layout>
    )
}

export async function getServerSideProps(context){
    const {params} = context;
    const {slug} = params;

    await db.connect();
    const product = await Product.findOne({slug}).lean();
    await db.disconnect();
    return{
      props:{
        product: db.convertDocToObj(product),
      }
    }
}
