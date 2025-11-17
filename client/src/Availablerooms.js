import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from './axios';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  useTheme,
  useMediaQuery,
  Alert,
  Chip,
  Card,
  CardContent,
  CardActions,
  Fade,
  Skeleton,
} from '@mui/material';
import {
  People,
  Category,
  ArrowForward,
  MeetingRoom,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(1.5, 3),
  textTransform: 'none',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

function AvailableRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams(location.search);
        const theme = params.get("theme");
        
        if (!theme) {
          setError("Theme parameter is required");
          setLoading(false);
          return;
        }

        const response = await axios.get(`/api/rooms?theme=${theme}`);
        if (response.data.success && Array.isArray(response.data.rooms)) {
          setRooms(response.data.rooms);
        } else {
          setError("Invalid response format from server");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch rooms");
        console.error("Failed to fetch rooms:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [location]);

  const getThemeColor = (themeName) => {
    const colors = {
      crypto: '#FFA726',
      gaming: '#42A5F5',
      movies: '#AB47BC',
      coding: '#26A69A',
      studying: '#66BB6A',
      hangout: '#EF5350',
      chill: '#29B6F6',
      travelling: '#FF7043',
    };
    return colors[themeName?.toLowerCase()] || theme.palette.primary.main;
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: 'calc(100vh - 64px)', py: { xs: 4, md: 6 }, backgroundColor: theme.palette.background.default }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 } }}>
          <Skeleton variant="text" width="40%" height={60} sx={{ mb: 4 }} />
          <Grid container spacing={3}>
            {[1, 2, 3].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: 'calc(100vh - 64px)', py: { xs: 4, md: 6 }, backgroundColor: theme.palette.background.default }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 } }}>
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: 2,
              '& .MuiAlert-message': {
                fontSize: '1.1rem',
              }
            }}
            action={
              <Button color="inherit" size="small" onClick={() => navigate('/')}>
                Go Home
              </Button>
            }
          >
            {error}
          </Alert>
        </Box>
      </Box>
    );
  }

  const themeParam = new URLSearchParams(location.search).get("theme");

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', py: { xs: 4, md: 6 }, backgroundColor: theme.palette.background.default }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3 } }}>
        <Box sx={{ mb: 5, textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 700, 
              color: theme.palette.primary.main,
              mb: 2,
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            Available Public Rooms
          </Typography>
          {themeParam && (
            <Chip
              icon={<Category />}
              label={themeParam.charAt(0).toUpperCase() + themeParam.slice(1)}
              color="primary"
              sx={{
                fontSize: '1rem',
                padding: '8px 16px',
                height: 'auto',
                backgroundColor: getThemeColor(themeParam),
                color: 'white',
                fontWeight: 600,
              }}
            />
          )}
        </Box>

        {rooms && rooms.length > 0 ? (
          <Grid container spacing={3}>
            {rooms.map((room, index) => (
              <Grid item xs={12} sm={6} md={4} key={room._id || index}>
                <Fade in timeout={300 + index * 100}>
                  <StyledCard>
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <MeetingRoom 
                          sx={{ 
                            fontSize: 32, 
                            color: getThemeColor(room.theme),
                            mr: 1.5 
                          }} 
                        />
                        <Typography 
                          variant="h5" 
                          component="h3" 
                          sx={{ 
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            flex: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {room.name}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <People sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
                          <Typography variant="body2" color="text.secondary">
                            Age Group: <strong>{room.ageGroup}</strong>
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Category sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
                          <Typography variant="body2" color="text.secondary">
                            Theme: <strong style={{ color: getThemeColor(room.theme) }}>
                              {room.theme?.charAt(0).toUpperCase() + room.theme?.slice(1)}
                            </strong>
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ p: 3, pt: 0 }}>
                      <StyledButton
                        component={Link}
                        to={`/watch?room=${room.roomId}`}
                        variant="contained"
                        fullWidth
                        endIcon={<ArrowForward />}
                        sx={{
                          backgroundColor: getThemeColor(room.theme),
                          '&:hover': {
                            backgroundColor: getThemeColor(room.theme),
                            opacity: 0.9,
                          },
                        }}
                      >
                        Join Room
                      </StyledButton>
                    </CardActions>
                  </StyledCard>
                </Fade>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <MeetingRoom sx={{ fontSize: 64, color: theme.palette.text.secondary, mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No rooms available
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              There are no public rooms available for this theme at the moment.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{ borderRadius: 2, textTransform: 'none', px: 4 }}
            >
              Create a Room
            </Button>
          </Paper>
        )}
      </Box>
    </Box>
  );
}

export default AvailableRooms;
