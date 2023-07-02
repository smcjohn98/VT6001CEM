import { Grid, Typography, Container, Button, Box, Modal, TextField, Alert } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { getUser, setUser } from '../redux/Reducer';
import { auth } from '../utils/firebase';
import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Link } from 'react-router-dom';

function AccountInfo() {
    const user = useSelector(getUser);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [name, setName] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);



    useEffect(() => {
        if (localStorage.getItem('userId')) {
            const userId = localStorage.getItem('userId')
            const name = localStorage.getItem('name')
            const email = localStorage.getItem('email')
            dispatch(setUser({ userId: userId, email: email, name: name }))
        }
    }, [])

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handlePasswordConfirmationChange = (event) => {
        setPasswordConfirmation(event.target.value);
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {

            if( !email.toLowerCase().match(/^\S+@\S+\.\S+$/) ){
                setErrorMessage('Not Valid Email')
                return 
            }
            if( password.length < 6 ){
                setErrorMessage('Password should be at least 6 characters')
                return 
            }

            //Login
            if (open === 1) {
                await signInWithEmailAndPassword(auth, email, password).then(userCredential => {
                    let obj = { userId: userCredential.user.uid, email: userCredential.user.email, name: userCredential.user.displayName }
                    dispatch(setUser(obj))
                    localStorage.setItem("userId", userCredential.user.uid)
                    localStorage.setItem("email", userCredential.user.email)
                    localStorage.setItem("name", userCredential.user.displayName)
                    handleClose()
                });
            }
            else {
                if( password !== passwordConfirmation){
                    setErrorMessage('Password not match')
                    return 
                }
                if( !name ){
                    setErrorMessage('Name cannot be empty')
                    return 
                }

                await createUserWithEmailAndPassword(auth, email, password).then(userCredential => {
                    updateProfile(auth.currentUser, {displayName: name});
                    let obj = { userId: userCredential.user.uid, email: userCredential.user.email, name: name }
                    dispatch(setUser(obj))
                    localStorage.setItem("userId", userCredential.user.uid)
                    localStorage.setItem("email", userCredential.user.email)
                    localStorage.setItem("name", name)
                    handleClose()
                });
            }
        } catch (error) {
            setErrorMessage(error.message)
            console.error(error);
        }
        console.log(`Email: ${email}, Password: ${password}`);
    };

    const handleClose = (event) => {
        setOpen(0)
        setEmail('')
        setPassword('')
        setPasswordConfirmation('')
        setName('')
    }

    const handleLogout = (event) => {
        localStorage.removeItem("userId")
        localStorage.removeItem("email")
        localStorage.removeItem("name")
        dispatch(setUser({}))
    }

    return (
        <>
            <Modal open={open > 0} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        width: 400,
                        outline: 'none',
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h4" component="h1" sx={{ fontFamily: 'Raleway, sans-serif', fontSize: 32, mb: 3 }}>
                        {open === 1 ? 'Login' : 'Register'}
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={handleEmailChange}
                        />
                        <TextField
                            label="Password"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                        {
                            open === 2 &&
                            <>
                                <TextField
                                    label="Password Confirmation"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    type="password"
                                    value={passwordConfirmation}
                                    onChange={handlePasswordConfirmationChange}
                                />
                                <TextField
                                    label="Name"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={name}
                                    onChange={handleNameChange}
                                />

                            </>

                        }
                        {
                            errorMessage && <Alert severity="error">{errorMessage}</Alert>
                        }
                        
                        <Button type="submit" variant="contained" fullWidth>
                            {open === 1 ? 'Login' : 'Register'}
                        </Button>
                    </form>
                </Box>
            </Modal>



            <Container maxWidth="lg">
                <Grid container justifyContent="center" sx={{ mt: 5, backgroundColor: 'white', borderRadius: '30px', padding: '30px' }}>
                    <Grid item xs={12} sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" component="h1" sx={{ fontFamily: 'Raleway, sans-serif', fontSize: 32, mb: 3 }}>
                            Account Info
                        </Typography>
                        {!user.userId
                            ?
                            <div>
                                <Button onClick={e => { setOpen(1) }}>Login</Button>
                                <Button onClick={e => { setOpen(2) }}>Register</Button>
                            </div>
                            :
                            <div>
                                <Typography>Hi, {user.name}</Typography>
                                <Button component={Link} to="/chart" >Chart</Button>
                                <Button component={Link} to="/start" >Training</Button>
                                <Button onClick={handleLogout}>Logout</Button>
                            </div>
                        }
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}

export default AccountInfo;