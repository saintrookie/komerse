import { Button, Card, Grid, List, ListItem, ListItemText,TextField,Typography } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import { getError } from '../utils/error';
import { Store } from '../utils/store';
import useStyles from '../utils/styles';
import Cookies from 'js-cookie';

function profile() {
    const { state, dispatch } = useContext(Store);
    const { handleSubmit, control, formState: { errors }, setValue } = useForm();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const userInfo = state;
    const router = useRouter();
    const classes = useStyles();

    useEffect(() => {
        console.log(userInfo.userInfo.token);
        if(!userInfo){
            return router.push('/login');
        }
        setValue('name', userInfo.userInfo.name);
        setValue('email', userInfo.userInfo.email);
    }, []);

    const submitHandler = async ({ email, name, password, confirmPassword }) => {
        closeSnackbar();
        if(password !== confirmPassword){
            enqueueSnackbar('Confirm Password Not Match', {variant: 'error'});
            return;
        }
        try {
            const { data } = await axios.put('/api/users/profile', { 
                name, email, password },
                {headers: { 'Authorization': `Bearer ${userInfo.userInfo.token}` } },
            );
            dispatch({ type:'USER_LOGIN', payload: data });
            Cookies.set('userInfo', JSON.stringify(data));
            enqueueSnackbar('Profile updated Successfully', {variant: 'success'});
        } catch (err){
            enqueueSnackbar(getError(err), {variant: 'error'});
        }
    }
   
    return (
        <Layout title='Profile'>
            <Grid container spacing={1}>
                <Grid item md={3} xs={12}>
                    <Card variant="outlined" className={classes.section}>  
                        <List>
                            <NextLink href='/profile' passHref>
                                <ListItem selected button component="a">
                                    <ListItemText primary="User Profile"></ListItemText>
                                </ListItem>
                            </NextLink>
                            <NextLink href='/order-history' passHref>
                                <ListItem button component="a">
                                    <ListItemText primary="Order History"></ListItemText>
                                </ListItem>
                            </NextLink>
                        </List>  
                    </Card>
                </Grid>
                <Grid item md={9} xs={12}>
                    <Box><Typography component="h3" variant="h3">Profile</Typography></Box>
                    <Card variant="outlined" className={classes.section}>
                        <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
                            <List>
                                <ListItem>
                                    
                                    <Controller
                                        name='name'
                                        control={control}
                                        defaultValue=""
                                        rules={{
                                            required: true,
                                            minLength: 2
                                        }}
                                        render={({ field: { onChange, value }  }) => (
                                        <TextField
                                            variant="outlined" 
                                            fullWidth 
                                            id="name" 
                                            label="Name" 
                                            onChange={onChange}
                                            value={value}
                                            inputProps={{ type: 'name' }}
                                            error={Boolean(errors.name)}
                                            helperText={errors.name? errors.name.type === 'minLength'?'Name length more than 1':'Name is required':''}
                                        
                                        />
                                    )}></Controller>
                                
                                </ListItem>
                                <ListItem>
                                    <Controller
                                        name='email'
                                        control={control}
                                        defaultValue=""
                                        rules={{
                                            required: true,
                                            pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
                                        }}
                                        render={({ field: { onChange, value }  }) => (
                                        <TextField 
                                            variant="outlined" 
                                            fullWidth 
                                            id="email" 
                                            label="Email" 
                                            onChange={onChange}
                                            value={value}
                                            inputProps={{ type: 'email' }}
                                            error={Boolean(errors.email)}
                                            helperText={errors.email? errors.email.type === 'pattern'?'Email is not valid':'Email is required':''}
                                        
                                        />
                                    )}></Controller>
                                
                                </ListItem>
                                <ListItem>
                                    <Controller
                                        name='password'
                                        control={control}
                                        defaultValue=""
                                        rules={{
                                            validate: (value) => value === '' || value.length > 5 || 'Password is more than 5'
                                        }}
                                        render={({ field: { onChange, value } }) => (
                                        <TextField
                                            variant="outlined" 
                                            fullWidth 
                                            id="password" 
                                            label="Password" 
                                            onChange={onChange}
                                            value={value}
                                            inputProps={{ type: 'password' }}
                                            error={Boolean(errors.password)}
                                            helperText={errors.Password? 'Password Length is more than 5':''}
                                        
                                            
                                        />
                                        
                                    )}></Controller>
                                </ListItem>
                                <ListItem>
                                <Controller
                                        name='confirmPassword'
                                        control={control}
                                        defaultValue=""
                                        rules={{
                                            validate: (value) => value === '' || value.length > 5 || 'Password is more than 5'
                                        }}
                                        render={({ field: { onChange, value } }) => (
                                        <TextField 
                                            variant="outlined" 
                                            fullWidth 
                                            id="confirmPassword" 
                                            label="Confirm Password" 
                                            onChange={onChange}
                                            value={value}
                                            inputProps={{ type: 'password' }}
                                            error={Boolean(errors.confirmPassword)}
                                            helperText={errors.confirmPassword? 'Confirm Password Length is more than 5':''}
                                            
                                        />
                                        
                                    )}></Controller>
                                </ListItem>
                                <ListItem>
                                    <Button variant="contained" type="submit" color="primary" fullWidth>Update</Button>
                                </ListItem>
                            </List>
                        </form>
                    </Card>
                </Grid>
            </Grid>
            
            
        </Layout>
    )
}

export default dynamic(() => Promise.resolve(profile), {ssr: false});
