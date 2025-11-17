import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  TextField,
  Button,
  Avatar,
  Box,
  useTheme,
  useMediaQuery,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  Logout as LogoutIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useStateValue } from './StateProvider';
import { styled } from '@mui/material/styles';
import Logo from './Logo';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(42, 42, 42, 0.95)' 
    : 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 2px 20px rgba(0, 0, 0, 0.3)'
    : '0 2px 20px rgba(0, 0, 0, 0.1)',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.05)',
    '& fieldset': {
      borderColor: theme.palette.divider,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1.5),
    fontSize: '0.875rem',
  },
}));

function Header({ isDarkMode, toggleTheme }) {
  const [{ user, isAuth }, dispatch] = useStateValue();
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [theme, setTheme] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  function logout() {
    localStorage.removeItem('jwtToken');
    dispatch({
      type: "SET_USER",
      user: null,
      isAuth: false,
    });
    handleMenuClose();
    navigate('/login');
  }

  function searchVideo() {
    if (!isAuth) {
      alert("Login/Signup to create room");
      return;
    }
    if (roomId.trim() !== "") {
      navigate(`/watch?room=${roomId.trim()}`);
      setRoomId('');
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchVideo();
    }
  };

  return (
    <StyledAppBar position="sticky" elevation={0}>
      <Toolbar 
        sx={{ 
          justifyContent: 'space-between',
          px: { xs: 1, sm: 2, md: 3 },
          py: 1,
          gap: 2,
        }}
      >
        {/* Logo */}
        <Link to={'/'} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <Logo />
        </Link>

        {/* Search and Theme Selector - Hidden on small mobile */}
        {!isSmallMobile && (
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              flexGrow: 1, 
              justifyContent: 'center',
              gap: 1.5,
              maxWidth: { xs: '100%', md: '600px' },
              mx: { xs: 1, md: 3 },
            }}
          >
            <StyledTextField
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              onKeyPress={handleKeyPress}
              size="small"
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />,
              }}
              sx={{ 
                flex: { xs: 1, sm: '0 1 250px' },
                minWidth: { xs: '150px', sm: '200px' },
              }}
            />
            <Button
              variant="contained"
              onClick={searchVideo}
              size="small"
              sx={{
                borderRadius: 2,
                px: 2,
                textTransform: 'none',
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              {isMobile ? 'Go' : 'Join Room'}
            </Button>
            <FormControl 
              size="small" 
              sx={{ 
                minWidth: { xs: 100, sm: 140 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            >
              <InputLabel>Theme</InputLabel>
              <Select
                value={theme}
                onChange={(e) => {
                  const selectedTheme = e.target.value;
                  setTheme(selectedTheme);
                  if (selectedTheme) {
                    navigate(`/rooms?theme=${selectedTheme}`);
                  }
                }}
                label="Theme"
              >
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
        )}

        {/* Right Side Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
          <Tooltip title={isDarkMode ? 'Light Mode' : 'Dark Mode'}>
            <IconButton 
              onClick={toggleTheme} 
              sx={{
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: muiTheme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.05)',
                },
              }}
            >
              {isDarkMode ? <LightIcon /> : <DarkIcon />}
            </IconButton>
          </Tooltip>

          {user ? (
            <>
              <Tooltip title={user.username || 'User'}>
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{ p: 0.5 }}
                >
                  <Avatar
                    src={user.imgAddress}
                    sx={{
                      width: { xs: 36, sm: 40 },
                      height: { xs: 36, sm: 40 },
                      border: `2px solid ${muiTheme.palette.primary.main}`,
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    {user.username?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    minWidth: 200,
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {user.username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem 
                  component={Link}
                  to="/"
                  onClick={handleMenuClose}
                >
                  <ListItemIcon>
                    <HomeIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Home</ListItemText>
                </MenuItem>
                <MenuItem onClick={logout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Tooltip title="Sign Up / Login">
              <IconButton
                component={Link}
                to="/signup"
                sx={{
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: muiTheme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.05)',
                  },
                }}
              >
                <PersonIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
}

export default Header;
