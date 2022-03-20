import { Button, FormControl, FormControlLabel, List, ListItem, Radio, RadioGroup, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react'
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import Cookies from 'js-cookie';
import { Store } from '../utils/store';
import useStyles from '../utils/styles';
import { useSnackbar } from 'notistack';

export default function Payment() {
    const router = useRouter();
    const [ paymentMethod, setPaymentMethod ] = useState('');
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { state, dispatch } = useContext(Store);
    const { cart:{ shippingAddress }, } = state;
    const classes = useStyles();

    useEffect(() => {
        if (!shippingAddress.address) {
            router.push('/shipping');
        } else {
            setPaymentMethod(Cookies.get('paymentMethod') || '');
        }
    }, []);

    const submitHandler = async(e) => {
        closeSnackbar();
        e.preventDefault();
        if(!paymentMethod){
            enqueueSnackbar('Payment method is required', {variant: 'error'})
        } else {
            dispatch({ type:'SAVE_PAYMENT_METHOD', payload: paymentMethod });
            Cookies.set('paymentMethod', paymentMethod);
            router.push('/placeorder');
        }
    }

    return (
        <Layout title="Payment Method">
            <CheckoutWizard activeStep={2}></CheckoutWizard>
            <form className={classes.form} onSubmit={submitHandler}>
                <Typography component="h3" variant="h3">
                    Payment Method
                </Typography>
                <List>
                    <ListItem>
                        <FormControl component="fieldset">
                            <RadioGroup 
                                aria-label='Payment Method' 
                                name='paymentMethod'
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                <FormControlLabel 
                                    label="Paypal" 
                                    value="Paypal" 
                                    control={<Radio />}
                                ></FormControlLabel>
                                 <FormControlLabel 
                                    label="Stripe" 
                                    value="Stripe" 
                                    control={<Radio />}
                                ></FormControlLabel>
                                 <FormControlLabel 
                                    label="Cash" 
                                    value="Cash" 
                                    control={<Radio />}
                                ></FormControlLabel>
                            </RadioGroup>
                        </FormControl>
                    </ListItem>
                    <ListItem>
                        <Button fullWidth 
                            type="submit" 
                            variant="contained" 
                            color="primary">
                            Continue
                        </Button>
                    </ListItem>
                    <ListItem>
                        <Button fullWidth 
                            type="button" 
                            variant="contained" 
                            color="primary"
                            onClick={() => router.push('/shipping')}>
                            Back
                        </Button>
                    </ListItem>
                </List>
            </form>
        </Layout>
    );
}
