import { Button, List, ListItem, TextField, Typography, Link } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import Layout from '../components/Layout';
import useStyles from '../utils/styles';
import axios from 'axios';
import { Store } from '../utils/store';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';


export default function Login() {
    const router = useRouter();
    const {redirect} = router.query;
    const { state, dispatch } = useContext(Store);
    const { userInfo } = state;
    useEffect(() => {
        if(userInfo){
            router.push('/');
        }
    }, []);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const classes = useStyles();
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/users/login', { email, password });
            dispatch({ type:'USER_LOGIN', payload: data });
            Cookies.set('userInfo', JSON.stringify(data));
            router.push(redirect || '/');
        } catch (err){
            alert(err.response.data ? err.response.data.message : err.message);
        }
    }
    
  return (
    <Layout title="login">
        <form onSubmit={submitHandler} className={classes.form}>
            <Typography variant='h3' component='h3'>
                Login Here !
            </Typography>
            <List>
                <ListItem>
                    <TextField variant="outlined" fullWidth id="email" label="Email" inputProps={{ type: 'email' }} onChange={e => setEmail(e.target.value)} required></TextField>
                </ListItem>
                <ListItem>
                    <TextField variant="outlined" fullWidth id="password" label="Password" inputProps={{ type: 'password' }} onChange={e => setPassword(e.target.value)} required></TextField>
                </ListItem>
                <ListItem>
                    <Button variant="contained" type="submit" color="primary" fullWidth>Login</Button>
                </ListItem>
                <ListItem>
                    Dont have an account ? <NextLink href="/register"><Link> Register</Link></NextLink>
                </ListItem>
            </List>
        </form>
    </Layout>
  )
}
