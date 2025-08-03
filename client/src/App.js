import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';
import { lightTheme, darkTheme } from './theme';

import Header from './Header';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import Watch_Video from './Watch_Video';
import AvailableRooms from './Availablerooms';


function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const theme = useMemo(
    () => isDarkMode ? darkTheme : lightTheme,
    [isDarkMode]
  );

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Routes>
            <Route path='/' element={
              <>
                <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                <Container maxWidth="xl">
                  <Home />
                </Container>
              </>
            } />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/watch' element={
              <>
                <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                <Container maxWidth="xl">
                  <Watch_Video />
                </Container>
              </>
            } />
            <Route path='/rooms' element={
              <>
                <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
                <Container maxWidth="xl">
                  <AvailableRooms />
                </Container>
              </>
            } />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}
export default App;
