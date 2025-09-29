import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  useTheme,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from './axios';
import { useStateValue } from './StateProvider';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const StyledForm = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(3),
}));

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pfp, setPfp] = useState(null);
  const [imgAddress, setImgAddress] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [{ isAuth }, dispatch] = useStateValue();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const formData = new FormData();
    formData.append('image', pfp);

    try {
      const profileResponse = await axios.post('api/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const userData = {
        username,
        email,
        password,
        imgAddress: profileResponse.data.pfp,
      };

      const signupResponse = await axios.post('api/auth/signup', userData);
      const { token } = signupResponse.data;
      localStorage.setItem('jwtToken', token);
      
      dispatch({
        type: 'SET_AUTH',
        isAuth: true,
      });
      dispatch({
        type: 'SET_USER',
        user: userData
      });
      
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred during signup');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default,
        py: { xs: 4, md: 8 },
      }}
    >
      <Container component="main" maxWidth="xs">
        <StyledPaper elevation={3}>
          <Box
            onClick={() => navigate('/')}
            component="img"
            src="https://i.ibb.co/Q72pdsZR/Gemini-Generated-Image-sfia4ysfia4ysfia.png"
            alt="Logo"
            sx={{
              width: '200px',
              height: 'auto',
              mb: 4,
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          />

          <Typography component="h1" variant="h4" gutterBottom>
            Create Account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <StyledForm onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{ mb: 2 }}
            >
              Upload Profile Picture
              <input
                type="file"
                hidden
                onChange={(e) => setPfp(e.target.files[0])}
                required
              />
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                py: 1.5,
                mb: 2,
                fontSize: '1.1rem',
                borderRadius: theme.shape.borderRadius,
                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(76, 175, 80, 0.3)',
                },
              }}
            >
              Create Account
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1">
                Already a user?{' '}
                <Link
                  component={RouterLink}
                  to="/login"
                  sx={{
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </StyledForm>
        </StyledPaper>
      </Container>
    </Box>
  );
}
export default Signup;
