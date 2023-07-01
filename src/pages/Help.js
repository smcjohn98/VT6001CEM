import { Button, Grid, Typography, Container } from '@mui/material';
import { Link } from 'react-router-dom';

function Help() {
  const instruction = [
    'When App ask for permission of camera, allow it to access to capture pose.',
    'Select what pose you want to do in the dropdown.',
    'Read Instrctions of that pose so you will know how to do that pose.',
    'Click on Start pose and see the image of the that pose in the right side and replecate that image in front of camera.',
    'If you will do correctly the skeleton over the video will become green in color and sound will start playing',
  ];

  const cameraFixInstruction = [
    'Make sure you have allowed the permission of camera, if you have denined the permission, go to setting of your browser to allow the access of camera to the application.',
    'Make sure no any other application is not accessing camera at that time, if yes, close that application',
    'Try to close all the other opened broswers',
  ];

  return (
    <Container maxWidth="lg">
        <Grid container justifyContent="center" sx={{ mt: 5, backgroundColor: 'white', borderRadius: '30px', padding: '30px' }}>
            <Grid item xs={12} sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1" sx={{ fontFamily: 'Raleway, sans-serif', fontSize: 32 }}>
                    Basic Tutorials
                </Typography>
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                {instruction.map((tutorial, index) => (
                <Typography key={index} variant="body1" sx={{ my: 1 }}>
                    {index + 1}. {tutorial}
                </Typography>
                ))}
            </Grid>
            <Grid item xs={12}  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h2" sx={{ fontFamily: 'Raleway, sans-serif', fontSize: 32 }}>
                    Camera Not Working?
                </Typography>
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                {cameraFixInstruction.map((solution, index) => (
                    <Typography key={index} variant="body1" sx={{ my: 1 }}>
                        Solution {index + 1}. {solution}
                    </Typography>
                ))}
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center', mt: 4 }}>
                <Button variant="contained" component={Link} to="/" className="btn">
                    Back to Home
                </Button>
            </Grid>
        </Grid>
    </Container>
  );
}

export default Help;