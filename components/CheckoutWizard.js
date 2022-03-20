import { Step, StepLabel, Stepper } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import useStyles from '../utils/styles';

export default function CheckoutWizard({activeStep = 0}) {

    const classes = useStyles();

    return <Box sx={{ width: '100%' }}><Stepper className={classes.transparentBackground} activeStep={activeStep} alternativeLabel>
        {
            ['Login', 'Shipping Address', 'Payment Method', 'Place Order'].map(step => 
            (
                <Step key={step}><StepLabel>{step}</StepLabel></Step>
            ))
        }
    </Stepper></Box>
}
