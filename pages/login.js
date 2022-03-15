import { Button, List, ListItem, TextField, Typography } from '@mui/material'
import React from 'react'
import Layout from '../components/Layout'
import useStyles from '../utils/styles'

export default function Login() {
    const classes = useStyles();
  return (
    <Layout title="login">
        <form className={classes.form}>
            <Typography variant='h3' component='h3'>
                Login Here !
            </Typography>
            <List>
                <ListItem>
                    <TextField variant="outlined" fullWidth id="email" label="Email" inputProps={{ type: 'email' }}></TextField>
                </ListItem>
                <ListItem>
                    <TextField variant="outlined" fullWidth id="password" label="Password" inputProps={{ type: 'password' }}></TextField>
                </ListItem>
                <ListItem>
                    <Button variant="contained" color="primary" fullWidth>Login</Button>
                </ListItem>
            </List>
        </form>
    </Layout>
  )
}
