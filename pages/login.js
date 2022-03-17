import { Button, List, ListItem, TextField, Typography, Link } from '@mui/material'
import React, { useState } from 'react';
import NextLink from 'next/link';
import Layout from '../components/Layout';
import useStyles from '../utils/styles';
import axios from 'axios';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const classes = useStyles();
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/users/login', { email, password });
            alert('Success Login');
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
                    <TextField variant="outlined" fullWidth id="email" label="Email" inputProps={{ type: 'email' }} onChange={e => setEmail(e.target.value)}></TextField>
                </ListItem>
                <ListItem>
                    <TextField variant="outlined" fullWidth id="password" label="Password" inputProps={{ type: 'password' }} onChange={e => setPassword(e.target.value)}></TextField>
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
