import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import axios from './axios';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  useTheme,
  useMediaQuery,
  Container,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [roomType, setRoomType] = useState("private");
  const [roomName, setRoomName] = useState("");
  const [ageGroup, setAgeGroup] = useState("above 18");
  const [roomTheme, setRoomTheme] = useState("crypto");
  const [openAlert, setOpenAlert] = useState(false);

  async function goLive() {
    const token = localStorage.getItem('jwtToken');
    
    if (!token) {
      setOpenAlert(true);
      return;
    }

    const myUUID = uuidv4();

    if (roomType === "public") {
      try {
        await axios.post("/api/rooms", {
          roomId: myUUID,
          name: roomName,
          ageGroup: ageGroup,
          theme: roomTheme
        });
      } catch (err) {
        console.error("Error creating public room:", err);
        return;
      }
    }

    navigate(`watch?room=${myUUID}`);
  }

  const handleCloseAlert = () => {
    setOpenAlert(false);
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', py: { xs: 4, md: 8 }, backgroundColor: theme.palette.background.default }}>
      <Container maxWidth="lg">
        <Snackbar
          open={openAlert}
          autoHideDuration={3000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseAlert} severity="warning" sx={{ width: '100%' }}>
            Please login or signup to create a room
          </Alert>
        </Snackbar>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <StyledPaper elevation={3}>
              <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 4 }}>
                Welcome to our Chat App!
              </Typography>
              <Typography variant="h6" gutterBottom>
                Connect with friends, join chat rooms, and start chatting!
              </Typography>

              <Box sx={{ mt: 4 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Room Type</InputLabel>
                  <Select value={roomType} onChange={(e) => setRoomType(e.target.value)} label="Room Type">
                    <MenuItem value="private">Private</MenuItem>
                    <MenuItem value="public">Public</MenuItem>
                  </Select>
                </FormControl>

                {roomType === "public" && (
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      label="Room Name"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Age Group</InputLabel>
                      <Select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} label="Age Group">
                        <MenuItem value="above 18">Above 18</MenuItem>
                        <MenuItem value="below 18">Below 18</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel>Theme</InputLabel>
                      <Select value={roomTheme} onChange={(e) => setRoomTheme(e.target.value)} label="Theme">
                        {['crypto', 'gaming', 'movies', 'coding', 'studying', 'hangout', 'chill', 'travelling'].map((t) => (
                          <MenuItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                )}

                <Button
                  variant="contained"
                  color="primary"
                  onClick={goLive}
                  fullWidth
                  sx={{ mt: 4, py: 1.5 }}
                >
                  Create Room
                </Button>
              </Box>
            </StyledPaper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://img.freepik.com/free-photo/full-shot-people-use-apps-make-friends_23-2150575197.jpg?w=1480&t=st=1707546890~exp=1707547490~hmac=da62745c01eb0e84e31027e9deb0a6474792a288f39e94a7ef71319e98d7dd02"
              alt="Chat App"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: theme.spacing(2),
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Home;
