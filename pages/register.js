import { Button, List, ListItem, TextField, Typography, Link } from '@mui/material'
import React, { useContext, useEffect } from 'react';
import NextLink from 'next/link';
import Layout from '../components/Layout';
import useStyles from '../utils/styles';
import axios from 'axios';
import { Store } from '../utils/store';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';


export default function Register() {
    const { handleSubmit, control, formState: { errors }} = useForm();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const router = useRouter();
    const {redirect} = router.query;
    const { state, dispatch } = useContext(Store);
    const { userInfo } = state;
    useEffect(() => {
        if(userInfo){
            router.push('/');
        }
    }, []);

    const classes = useStyles();
    const submitHandler = async ({ email, name, password, confirmPassword }) => {
        closeSnackbar();
        if(password !== confirmPassword){
            enqueueSnackbar('Confirm Password Not Match', {variant: 'error'});
            return;
        }
        try {
            const { data } = await axios.post('/api/users/register', { name, email, password });
            dispatch({ type:'USER_LOGIN', payload: data });
            Cookies.set('userInfo', JSON.stringify(data));
            router.push(redirect || '/');
        } catch (err){
            enqueueSnackbar(err.response.data ? err.response.data.message : err.message, {variant: 'error'});
        }
    }
    
    return (
        <Layout title="Register">
            <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
                <Typography variant='h3' component='h3'>
                    Register Here !
                </Typography>
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
                                required: true,
                                minLength: 6
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
                                helperText={errors.password? errors.password.type === 'minLength'?'Password Length is more than 5':'Password is required':''}
                                
                            />
                            
                        )}></Controller>
                    </ListItem>
                    <ListItem>
                    <Controller
                            name='confirmPassword'
                            control={control}
                            defaultValue=""
                            rules={{
                                required: true,
                                minLength: 6
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
                                helperText={errors.confirmPassword? errors.confirmPassword.type === 'minLength'?'Confirm Password Length is more than 5':'Confirm Password is required':''}
                                
                            />
                            
                        )}></Controller>
                    </ListItem>
                    <ListItem>
                        Already Have Account ? &nbsp;<NextLink href={`/login?redirect=${redirect || '/'}`} passHref><Link> Login</Link></NextLink>
                    </ListItem>
                    <ListItem>
                        <Button variant="contained" type="submit" color="primary" fullWidth>Register</Button>
                    </ListItem>
                </List>
            </form>
        </Layout>
    )
}
