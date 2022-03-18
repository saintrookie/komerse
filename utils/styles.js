import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    navbar: {
        backgroundColor: '#F88379',
        '& a':{
            color: '#FFFFFF',
            marginLeft: 10,
            textDecoration: 'none',
        },
    },
    brand :{
        fontWeight: 'bold',
        fontSize: '2em',

    },
    grow : {
        flexGrow: 1
    },
    main:{
        padding: '6em 0em',
        minHeight: '80vh',
    },
    footer:{
        textAlign: 'center',
    },
    section: {
        marginTop: 10,
        marginBottom: 10,
    },
    form : {
        h3: {
            textAlign: 'center',
        },
        maxWidth: 600,
        margin: '0 auto',
    },
    navbarButton:{
        color: '#fff',
        textTransform: 'initial'
    }
});

export default useStyles;