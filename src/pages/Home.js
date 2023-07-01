import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Grid, Typography, Button } from '@mui/material'

export default function Home() {
    return (
        <Container maxWidth="lg">
            <Grid container justifyContent="center" sx={{ mt: 5, backgroundColor: 'white', borderRadius: '30px', padding: '30px' }}>
                <Grid item xs={12} sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography className="title">
                        AI Sport Trainer
                    </Typography>
                </Grid>
                <Grid item xs={12} lg={6} sx={{ textAlign: 'center', mb: 4 }}>
                    <Button variant="contained" component={Link} to="/start" className="btn">
                        Start Training
                    </Button>
                    <Button variant="contained" component={Link} to="/help" className="btn">
                        Helps
                    </Button>
                </Grid>
            </Grid>
        </Container>

    )
}
