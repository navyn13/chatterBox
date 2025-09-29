import './ChatRoom.css'
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client"
import { useStateValue } from './StateProvider';
import SendIcon from '@mui/icons-material/Send';
import { Box, Typography, Avatar, Paper, Alert, Snackbar } from '@mui/material';

const socket = io(process.env.REACT_APP_SERVER_URL);

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

    return (
        <Box className='ChatRoom'>
            <Paper className='live_chat' elevation={3}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                        <Typography variant="h5" gutterBottom>Live Chat</Typography>
                        <Typography variant="body1" color="textSecondary">Room ID: {roomID}</Typography>
                    </Box>
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        backgroundColor: isConnected ? '#e8f5e9' : '#ffebee',
                        padding: '4px 12px',
                        borderRadius: '16px'
                    }}>
                        <Box sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: isConnected ? '#4caf50' : '#f44336'
                        }} />
                        <Typography variant="body2" color={isConnected ? 'success.main' : 'error.main'}>
                            {isConnected ? 'Connected' : 'Disconnected'}
                        </Typography>
                    </Box>
                </Box>
                
                <Snackbar 
                    open={!!error} 
                    autoHideDuration={6000} 
                    onClose={() => setError('')}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar>
                <Box className='messages' ref={messagesEndRef}>
                    {messages.map((msg) => (
                        <Box key={msg.id || Date.now() + Math.random()} sx={{
                            display: 'flex',
                            alignItems: 'start',
                            p: 1,
                            mb: 1,
                            backgroundColor: msg.username === user?.username ? '#e3f2fd' : '#f5f5f5',
                            borderRadius: 2,
                            maxWidth: '100%',
                            wordBreak: 'break-word'
                        }}>
                            <Avatar 
                                src={msg.userImgAddress}
                                sx={{ width: 32, height: 32, mr: 1 }}
                            />
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" color="primary">
                                    {msg.username}
                                </Typography>
                                <Typography variant="body2">
                                    {msg.message}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>

                <form
                    className='msg_block'
                    onSubmit={(e) => {
                        e.preventDefault();
                        sendMessage();
                    }}
                >
                    <input
                        id='inp_msg'
                        value={send_message}
                        onChange={(e) => setSendMessage(e.target.value)}
                        placeholder="Type a message..."
                    />
                    <button 
                        type='submit' 
                        disabled={!send_message.trim()}
                        style={{ 
                            opacity: send_message.trim() ? 1 : 0.6,
                            cursor: send_message.trim() ? 'pointer' : 'not-allowed'
                        }}
                    >
                        Send <SendIcon />
                    </button>
                </form>
            </Paper>
        </Box>
    );
}

export default ChatRoom;