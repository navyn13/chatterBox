import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Button,
  Avatar,
  Box,
  useTheme,
  styled,
  alpha,
  Select,
  MenuItem,
  FormControl
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
} from '@mui/icons-material';
import { useStateValue } from './StateProvider';
import { v4 as uuidv4 } from 'uuid';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

function Header({ isDarkMode, toggleTheme }) {
  const [{ user, isAuth }, dispatch] = useStateValue();
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [theme, setTheme] = useState('');
  const muiTheme = useTheme();

  function logout() {
    localStorage.removeItem('jwtToken');
    dispatch({
      type: "SET_USER",
      isAuth: false,
    });
  }

  function searchVideo() {
    if (!isAuth) {
      alert("Login/Signup to create room");
      return;
    }
    if (roomId !== "") {
      navigate(`watch?room=${roomId}`);
    }
  }

  return (
    <AppBar position="sticky" elevation={2}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Link to={'/'} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Box
            component="img"
            src="https://i.ibb.co/Q72pdsZR/Gemini-Generated-Image-sfia4ysfia4ysfia.png"
            alt="logo"
            sx={{
              height: 50,
              maxHeight: { xs: 40, md: 50 },
              cursor: 'pointer',
            }}
          />
        </Link>

        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'center' }}>
          <Search>
            <InputBase
              placeholder="Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              sx={{ ml: 2, flex: 1 }}
            />
          </Search>
          <Button
            variant="contained"
            onClick={searchVideo}
            sx={{ ml: 1 }}
          >
            Search
          </Button>
          <FormControl sx={{ ml: 2, minWidth: 120 }}>
            <Select
              value={theme}
              onChange={(e) => {
                if (e.target.value) {
                  navigate(`/rooms?theme=${e.target.value}`);
                }
              }}
              displayEmpty
            >
              <MenuItem value="">Select Theme</MenuItem>
              <MenuItem value="crypto">Crypto</MenuItem>
              <MenuItem value="gaming">Gaming</MenuItem>
              <MenuItem value="movies">Movies</MenuItem>
              <MenuItem value="coding">Coding</MenuItem>
              <MenuItem value="studying">Studying</MenuItem>
              <MenuItem value="hangout">Hangout</MenuItem>
              <MenuItem value="chill">Chill</MenuItem>
              <MenuItem value="travelling">Travelling</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={toggleTheme} color="inherit">
            {isDarkMode ? <LightIcon /> : <DarkIcon />}
          </IconButton>

          {user ? (
            <Avatar
              onClick={logout}
              src={user.imgAddress}
              sx={{
                width: 40,
                height: 40,
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            />
          ) : (
            <IconButton
              color="inherit"
              component={Link}
              to="/signup"
            >
              <PersonIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
