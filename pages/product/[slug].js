import { useRouter } from 'next/router';
import React from 'react';
import NextLink from 'next/link';
import Link from '@mui/material/Link';
import data from '../../utils/data';
import Layout from '../../components/Layout';
import useStyles from '../../utils/styles';
import { Button, Grid, List, ListItem, Typography } from '@mui/material';
import Image from 'next/image';

export default function ProductScreen() {
    const classes = useStyles();
    const router = useRouter();
    const { slug } = router.query;
    const product = data.products.find((a) => a.slug === slug);

    if(!product){
        return <div>Product Not Found</div>
    }

    return (
        <Layout title={product.name} description={product.description}>
            <div className={classes.section}>
                <NextLink href="/" passHref>
                    <Link>back to products</Link>
                </NextLink>
            </div>
            <Grid container spacing={1}>
                <Grid item md={6} xs={12}>
                    <Image 
                        src={product.image} 
                        alt={product.name} 
                        width={200} 
                        height={280} 
                        layout="responsive">

                    </Image>
                </Grid>
                <Grid item md={3} xs={12}>
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
                <Grid item md={3} xs={12}>
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
                            <Button fullWidth variant="contained" color="success">Add To Cart</Button>
                        </ListItem>
                    </List>
                </Grid>
            </Grid>
        </Layout>
    )
}
