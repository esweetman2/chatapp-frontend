import React from 'react'
import "../src/App.css"
import { Box } from '@mui/material'


export default function Layout({ children }: { children: React.ReactNode }) {

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {children}
        </Box>
    )
}
