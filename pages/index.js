import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import NextLink from 'next/link';
import Layout from '../components/Layout';
import data from '../utils/data';

export default function Home() {
  return (
    <Layout>
      <Grid container spacing={3}>
        {data.products.map((product) => (
          <Grid item md={4} key={product.name}>
            <Card>
              <NextLink href={`product/${product.slug}`} passHref>
                <a>
                  <CardActionArea>
                    <CardMedia 
                      component="img"
                      image={product.image}
                      title={product.name}  
                    ></CardMedia>
                    <CardContent>
                      <Typography>{product.name}</Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Typography>
                      {product.price}
                    </Typography>
                    <Button>
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
