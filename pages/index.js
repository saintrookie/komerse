import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import SendIcon from '@mui/icons-material/Send';
import NextLink from 'next/link';
import Layout from '../components/Layout';
import Product from '../models/Product';
import db from '../utils/db';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { Store } from '../utils/store';

export default function Home(props) {
  const router = useRouter();
  const {state, dispatch} = useContext(Store);
  const {products} = props; 
  const addToCartHandler = async (product) => {
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
    <Layout>
      <h1>New Products</h1>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item md={4} key={product.name}>
            <Card variant="outlined">
              <NextLink href={`/product/${product.slug}`} passHref>
                <a>
                  <CardActionArea>
                    <CardMedia 
                      component="img"
                      image={product.image}
                      title={product.name}  
                    ></CardMedia>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">{product.name}</Typography>
                      <Typography  variant="body2" color="text.secondary">
                      Rp {product.price} K
                    </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                   
                    <Button variant="outlined" size="secondary" endIcon={<SendIcon />} onClick={()=>addToCartHandler(product)} >
                      Add Cart
                    </Button>
                  </CardActions>
                </a>
              </NextLink>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Layout>
  )
}

export async function getServerSideProps(){
  await db.connect();
  const products = await Product.find({}).lean();
  await db.disconnect();
  return{
    props:{
      products: products.map(db.convertDocToObj),
    }
  }
}