import { Button, List, ListItem, TextField, Typography } from '@mui/material';
import React, { useContext, useEffect } from 'react';
import Layout from '../components/Layout';
import useStyles from '../utils/styles';
import { Store } from '../utils/store';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { Controller, useForm } from 'react-hook-form';
import CheckoutWizard from '../components/CheckoutWizard';


export default function Shipping() {
    const { handleSubmit, control, formState: { errors }, setValue} = useForm();
    const router = useRouter();
    const { state, dispatch } = useContext(Store);
    const { userInfo, cart:{shippingAddress} } = state;
    useEffect(() => {
        if(!userInfo){
            router.push('/login?redirect=/shipping');
        }
        setValue('fullName', shippingAddress.fullName);
        setValue('address', shippingAddress.address);
        setValue('city', shippingAddress.city);
        setValue('postalCode', shippingAddress.postalCode);
        setValue('country', shippingAddress.country);
    }, []);

    const classes = useStyles();
    const submitHandler = ({ fullName, address, city, postalCode, country }) => {
        dispatch({ type:'SAVE_SHIPPING_ADDRESS', payload: { fullName, address, city, postalCode, country } });
        Cookies.set('shippingAddress', JSON.stringify({ fullName, address, city, postalCode, country }));
        router.push('/payment');
    };
    
    return (
        <Layout title="Shipping Address">
            <CheckoutWizard activeStep={1} />
            <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
                <Typography variant='h3' component='h3'>
                    Shipping Address
                </Typography>
                <List>
                    <ListItem>
                        <Controller
                            name='fullName'
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
                                id="fullName" 
                                label="Full Name" 
                                onChange={onChange}
                                value={value}
                                inputProps={{ type: 'fullName' }}
                                error={Boolean(errors.fullName)}
                                helperText={errors.fullName? errors.fullName.type === 'minLength'?'FullName length more than 1':'FullName is required':''}
                            
                            />
                        )}></Controller>
                    
                    </ListItem>
                    <ListItem>
                        <Controller
                            name='address'
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
                                id="address" 
                                label="Address" 
                                rows={5}
                                multiline
                                placeholder="Address"
                                onChange={onChange}
                                value={value}
                                inputProps={{ type: 'address' }}
                                error={Boolean(errors.address)}
                                helperText={errors.address? errors.address.type === 'minLength'?'address length more than 1':'address is required':''}
                            
                            />
                        )}></Controller>
                    
                    </ListItem>
                    <ListItem>
                        <Controller
                            name='city'
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
                                id="city" 
                                label="City" 
                                onChange={onChange}
                                value={value}
                                inputProps={{ type: 'city' }}
                                error={Boolean(errors.city)}
                                helperText={errors.city? errors.city.type === 'minLength'?'city length more than 1':'city is required':''}
                            
                            />
                        )}></Controller>
                    
                    </ListItem>
                    <ListItem>
                        <Controller
                            name='postalCode'
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
                                id="postalCode" 
                                label="Postal Code" 
                                onChange={onChange}
                                value={value}
                                inputProps={{ type: 'postalCode' }}
                                error={Boolean(errors.postalCode)}
                                helperText={errors.postalCode? errors.postalCode.type === 'minLength'?'postal code length more than 1':'postal code is required':''}
                            
                            />
                        )}></Controller>
                    
                    </ListItem>
                    <ListItem>
                        <Controller
                            name='country'
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
                                id="country" 
                                label="Country" 
                                onChange={onChange}
                                value={value}
                                inputProps={{ type: 'country' }}
                                error={Boolean(errors.country)}
                                helperText={errors.country? errors.country.type === 'minLength'?'Country length more than 1':'Country is required':''}
                            
                            />
                        )}></Controller>
                    
                    </ListItem>
                    <ListItem>
                        <Button variant="contained" type="submit" color="primary" fullWidth>Continue</Button>
                    </ListItem>
                </List>
            </form>
        </Layout>
    )
}
