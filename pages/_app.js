import { Slide } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { useEffect } from 'react'
import '../styles/globals.css'
import { StoreProvider } from '../utils/store';

function MyApp({ Component, pageProps }) {
  useEffect(()=> {
    const jssStyle = document.querySelector('#jss-server-side');
    if(jssStyle){
      jssStyle.parentElement.removeChild(jssStyle);
    }
  }, []);
  return (
    <SnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'center' }} TransitionComponent={Slide}>
      <StoreProvider>
        <Component {...pageProps} />
      </StoreProvider>
    </SnackbarProvider>
    
  )
}

export default MyApp
