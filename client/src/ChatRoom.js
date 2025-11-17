import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client"
import { useStateValue } from './StateProvider';
import {
  Send as SendIcon,
  Chat as ChatIcon,
  WifiOff,
  Wifi,
  Person,
} from '@mui/icons-material';
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Alert,
  Snackbar,
  TextField,
  IconButton,
  Chip,
  useTheme,
  useMediaQuery,
  Fade,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const socket = io(process.env.REACT_APP_SERVER_URL);

const StyledPaper = styled(Paper)(({ theme }) => ({
  height: 'calc(100vh - 200px)',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    height: 'calc(100vh - 150px)',
  },
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.02)' 
    : 'rgba(0, 0, 0, 0.02)',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.2)' 
      : 'rgba(0, 0, 0, 0.2)',
    borderRadius: '4px',
    '&:hover': {
      background: theme.palette.mode === 'dark' 
        ? 'rgba(255, 255, 255, 0.3)' 
        : 'rgba(0, 0, 0, 0.3)',
    },
  },
}));

const MessageBubble = styled(Box)(({ theme, isOwn }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
  flexDirection: isOwn ? 'row-reverse' : 'row',
  animation: 'fadeIn 0.3s ease-in',
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
      transform: 'translateY(10px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

const MessageContent = styled(Box)(({ theme, isOwn }) => ({
  maxWidth: '70%',
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.spacing(2),
  backgroundColor: isOwn 
    ? theme.palette.primary.main 
    : theme.palette.mode === 'dark' 
      ? 'rgba(255, 255, 255, 0.1)' 
      : theme.palette.grey[100],
  color: isOwn ? 'white' : theme.palette.text.primary,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  [theme.breakpoints.down('sm')]: {
    maxWidth: '85%',
  },
}));

const InputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
}));

function ChatRoom() {
    const [{ user }] = useStateValue();
    const [send_message, setSendMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [error, setError] = useState('');
    const queryParams = new URLSearchParams(window.location.search);
    const roomID = queryParams.get('room');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Connection event handlers
        socket.on('connect', () => {
            setIsConnected(true);
            setError('');
            // Join room on successful connection
            socket.emit('joinRoom', roomID);
        });

        socket.on('connect_error', () => {
            setError('Failed to connect to chat server');
            setIsConnected(false);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
            setError('Disconnected from chat server');
        });

        // Message handler
        const handleReceiveMsg = (data) => {
            console.log('Received message:', data);
            setMessages(prevMessages => {
                // Check if message with this ID already exists
                if (!data.id || !prevMessages.some(msg => msg.id === data.id)) {
                    return [...prevMessages, data];
                }
                return prevMessages;
            });
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        };

        socket.on('receive_msg', handleReceiveMsg);

        // Join room on initial load
        if (socket.connected) {
            socket.emit('joinRoom', roomID);
        }

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('connect_error');
            socket.off('receive_msg', handleReceiveMsg);
        };
    }, [roomID]);

    function sendMessage() {
        if (!isConnected) {
            setError('Cannot send message: Not connected to chat server');
            return;
        }
        
        if (send_message.trim()) {
            const messageData = {
                id: Date.now() + Math.random(), // Unique ID for each message
                message: send_message.trim(),
                username: user?.username,
                room: roomID,
                userImgAddress: user?.imgAddress,
                timestamp: new Date().toISOString()
            };
            
            console.log('Sending message:', messageData);
            
            // Only send to server, don't add locally
            socket.emit("send_msg", messageData);
            setSendMessage('');
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isOwnMessage = (username) => username === user?.username;

    return (
        <Box 
            className='ChatRoom' 
            sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <StyledPaper elevation={3}>
                {/* Header */}
                <Box 
                    sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        p: 2.5,
                        backgroundColor: theme.palette.background.paper,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <ChatIcon 
                            sx={{ 
                                fontSize: 32, 
                                color: theme.palette.primary.main 
                            }} 
                        />
                        <Box>
                            <Typography 
                                variant="h5" 
                                sx={{ 
                                    fontWeight: 600,
                                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                                }}
                            >
                                Live Chat
                            </Typography>
                            <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{ 
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    mt: 0.5
                                }}
                            >
                                <Person sx={{ fontSize: 14 }} />
                                Room: {roomID}
                            </Typography>
                        </Box>
                    </Box>
                    <Chip
                        icon={isConnected ? <Wifi /> : <WifiOff />}
                        label={isConnected ? 'Connected' : 'Disconnected'}
                        color={isConnected ? 'success' : 'error'}
                        variant="outlined"
                        sx={{
                            fontWeight: 600,
                            borderWidth: 2,
                            '& .MuiChip-icon': {
                                fontSize: 18,
                            },
                        }}
                    />
                </Box>
                
                {/* Error Snackbar */}
                <Snackbar 
                    open={!!error} 
                    autoHideDuration={6000} 
                    onClose={() => setError('')}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert 
                        onClose={() => setError('')} 
                        severity="error" 
                        sx={{ 
                            width: '100%',
                            borderRadius: 2,
                        }}
                    >
                        {error}
                    </Alert>
                </Snackbar>

                {/* Messages Container */}
                <MessagesContainer ref={messagesEndRef}>
                    {messages.length === 0 ? (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                color: theme.palette.text.secondary,
                            }}
                        >
                            <ChatIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                            <Typography variant="h6" color="text.secondary">
                                No messages yet
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Start the conversation!
                            </Typography>
                        </Box>
                    ) : (
                        messages.map((msg, index) => {
                            const isOwn = isOwnMessage(msg.username);
                            return (
                                <Fade in key={msg.id || index} timeout={300}>
                                    <MessageBubble isOwn={isOwn}>
                                        <Avatar 
                                            src={msg.userImgAddress}
                                            sx={{ 
                                                width: { xs: 36, sm: 40 }, 
                                                height: { xs: 36, sm: 40 },
                                                border: `2px solid ${theme.palette.primary.main}`,
                                            }}
                                        >
                                            {msg.username?.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <MessageContent isOwn={isOwn}>
                                            <Typography 
                                                variant="subtitle2" 
                                                sx={{ 
                                                    fontWeight: 600,
                                                    mb: 0.5,
                                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                                    color: isOwn ? 'white' : theme.palette.primary.main,
                                                }}
                                            >
                                                {msg.username}
                                            </Typography>
                                            <Typography 
                                                variant="body2"
                                                sx={{
                                                    wordBreak: 'break-word',
                                                    fontSize: { xs: '0.875rem', sm: '1rem' },
                                                    lineHeight: 1.5,
                                                }}
                                            >
                                                {msg.message}
                                            </Typography>
                                            {msg.timestamp && (
                                                <Typography 
                                                    variant="caption" 
                                                    sx={{ 
                                                        display: 'block',
                                                        mt: 0.5,
                                                        opacity: 0.7,
                                                        fontSize: '0.7rem',
                                                    }}
                                                >
                                                    {new Date(msg.timestamp).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </Typography>
                                            )}
                                        </MessageContent>
                                    </MessageBubble>
                                </Fade>
                            );
                        })
                    )}
                </MessagesContainer>

                {/* Input Container */}
                <InputContainer
                    component="form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        sendMessage();
                    }}
                >
                    <TextField
                        fullWidth
                        value={send_message}
                        onChange={(e) => setSendMessage(e.target.value)}
                        placeholder="Type a message..."
                        variant="outlined"
                        size={isMobile ? "small" : "medium"}
                        disabled={!isConnected}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                backgroundColor: theme.palette.background.default,
                                '& fieldset': {
                                    borderColor: theme.palette.divider,
                                },
                                '&:hover fieldset': {
                                    borderColor: theme.palette.primary.main,
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: theme.palette.primary.main,
                                    borderWidth: 2,
                                },
                            },
                        }}
                        InputProps={{
                            sx: {
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                            },
                        }}
                    />
                    <IconButton
                        type="submit"
                        disabled={!send_message.trim() || !isConnected}
                        color="primary"
                        sx={{
                            backgroundColor: theme.palette.primary.main,
                            color: 'white',
                            width: { xs: 44, sm: 56 },
                            height: { xs: 44, sm: 56 },
                            '&:hover': {
                                backgroundColor: theme.palette.primary.dark,
                                transform: 'scale(1.05)',
                            },
                            '&:disabled': {
                                backgroundColor: theme.palette.action.disabledBackground,
                                color: theme.palette.action.disabled,
                            },
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <SendIcon />
                    </IconButton>
                </InputContainer>
            </StyledPaper>
        </Box>
    );
}

export default ChatRoom;