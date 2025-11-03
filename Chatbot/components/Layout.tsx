import React from 'react'
import "../src/App.css"
// import { makeStyles } from '@mui/styles';
// import { Container } from '@mui/material'
import { Box } from '@mui/material'

// const useStyles = makeStyles((theme:any) => {
//     return {
//         toolbar: theme.mixins.toolbar
//     }
// })


export default function Layout({ children }: { children: React.ReactNode }) {

    // const classes = useStyles();

    return (
        // <Container maxWidth={false}  style={{ padding: '20px', backgroundColor: '#f0f0f0', display: 'flex' }}>

        // <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', backgroundColor:'yellow' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {/* <Container maxWidth="lg" style={{ padding: '20px', backgroundColor: '#f0f0f0' }}> */}
            {/* <div className={classes.toolbar}> */}


            {children}
        </Box>
    // {/* </div> */ }
    // {/* </Container> */ }
        // </div>
        // </Container>
    )
}
