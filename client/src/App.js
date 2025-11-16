import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';
import { useStateValue } from './StateProvider';
import axios from './axios';
import { lightTheme, darkTheme } from './theme';

import Header from './Header';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import ChatRoom from './ChatRoom';
import AvailableRooms from './Availablerooms';
import ProtectedRoute from './ProtectedRoute';


function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [{ }, dispatch] = useStateValue();
  
  const theme = useMemo(
    () => isDarkMode ? darkTheme : lightTheme,
    [isDarkMode]
  );

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      axios.get('api/auth/verify')
        .then(response => {
          if (response.data.user) {
            dispatch({
              type: 'SET_USER',
              user: response.data.user
            });
            dispatch({
              type: 'SET_AUTH',
              isAuth: true
            });
          }
        })
        .catch(error => {
          if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('jwtToken');
          }
        })
        .finally(() => {
          setIsLoading(false); // Set loading to false after verification
        });
    } else {
      setIsLoading(false); // Set loading to false if no token
    }
  }, [dispatch]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Show loading state while verifying token
  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}>
          Loading...
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/' element={
              <ProtectedRoute>
                <>
                  <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                  <Container maxWidth="xl">
                    <Home />
                  </Container>
                </>
              </ProtectedRoute>
            } />
            <Route path='/watch' element={
              <ProtectedRoute>
                <>
                  <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                  <Container maxWidth="xl">
                    <ChatRoom />
                  </Container>
                </>
              </ProtectedRoute>
            } />
            <Route path='/rooms' element={
              <ProtectedRoute>
                <>
                  <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                  <Container maxWidth="xl">
                    <AvailableRooms />
                  </Container>
                </>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}
export default App;