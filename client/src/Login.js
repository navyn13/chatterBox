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

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [{ }, dispatch] = useStateValue();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('api/auth/login', {
        email: email,
        password: password
      });

      if (response.data.token) {
        dispatch({
          type: 'SET_USER',
          user: response.data.user,
        });

        dispatch({
          type: 'SET_AUTH',
          isAuth: true,
        });
        console.log(response.data.token)
        localStorage.setItem('jwtToken', response.data.token);
        navigate('/');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred during login');
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
            alt="StreamVista"
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
            Welcome Back
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
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
            />
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
              Sign In
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body1">
                Don't have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/signup"
                  sx={{
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </StyledForm>
        </StyledPaper>
      </Container>
    </Box>
  );
}

export default Login;
