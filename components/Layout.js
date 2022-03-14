import React, { useContext } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar'
import AppBar from '@mui/material/AppBar';
import Link from '@mui/material/Link';
import Badge  from '@mui/material/Badge';
import useStyles from '../utils/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import CssBaseline from '@mui/material/CssBaseline';
import { Store } from '../utils/store';
import Cookies from 'js-cookie';


export default function Layout({ title, description, children }) {

    const { state, dispatch } = useContext(Store);
    const { darkMode, cart } = state;
    const theme = createTheme({
            typography: {
                h1:{
                    fontSize: '3em',
                    fontWeight: 400,
                    margin: '1em 0',
                },
                h2:{
                    fontSize: '2.8em',
                    fontWeight: 400,
                    margin: '1em 0',
                },
                h3:{
                    fontSize: '2.6em',
                    fontWeight: 400,
                    margin: '1em 0',
                },
               
            },
            palette: {
                mode: darkMode ? 'dark' : 'light',
                
            },
        
    });

    const classes = useStyles();
    const darkModeChangeHandler = () => {
        dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
        const newDarkMode = !darkMode;
        Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
    };

    return (
        <div>
            <Head>
                <title>{title ? `${title} - Komerse` : `Komerse`}</title>
                {description && <meta name="description" content={description}></meta>}
            </Head>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AppBar position='static' className={ classes.navbar }>
                    <Toolbar>
                        <NextLink href="/" passHref>
                            <Link>
                                <Typography className={classes.brand}>
                                    KOTANXZ
                                </Typography>
                            </Link>
                        </NextLink>
                        <div className={classes.grow}></div>
                        <Switch checked={darkMode} onChange={darkModeChangeHandler} />
                        <NextLink href="/login" passHref>
                            <Link>Login</Link>
                        </NextLink>
                        <NextLink href="/cart" passHref>
                            <Link>
                                {cart.cartItems.length > 0 ? (
                                    <Badge
                                        color="secondary"
                                        badgeContent={cart.cartItems.length}
                                    >
                                        Cart
                                    </Badge>
                                    ) : (
                                    'Cart'
                                )}
                            </Link>
                        </NextLink>
                    </Toolbar>
                </AppBar>
                <Container className={ classes.main }>
                    { children }
                </Container>
                <footer className={ classes.footer }>
                    <Typography>
                        All rights reserved. Komerse
                    </Typography>
                </footer>
            </ThemeProvider>
        </div>
    )
}
