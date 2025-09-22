import './Watch_Video.css'
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client"
import { useStateValue } from './StateProvider';
import SendIcon from '@mui/icons-material/Send';
const socket = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:4000");

function Watch_Video() {
    const [{ user }] = useStateValue();
    const [send_message, setSendMessage] = useState('');
    const queryParams = new URLSearchParams(window.location.search);
    const roomID = queryParams.get('room');
    const messagesEndRef = useRef(null);
    useEffect(() => {
        const handleReceiveMsg = (data) => {
            const div = document.createElement("div");
            const img = document.createElement('img');
            img.src = data.userImgAddress;
            img.style.width = '30px'; // Example: Change width to 50 pixels
            img.style.height = '30px';
            img.style.marginRight = '10px'
            img.style.borderRadius = '50%';
            div.appendChild(img)
            const textNode = document.createTextNode(data.username + " : " + data.message);
            div.appendChild(textNode);
            div.style.border = '1px solid #000000'
            div.style.marginBottom = '2px'
            div.style.backgroundColor = 'aliceblue'
            document.querySelector('.messages').appendChild(div);
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); 
        };

        socket.on('recieve_msg', handleReceiveMsg)
        return () => {
            socket.off('recieve_msg', handleReceiveMsg);
        };
    }, [socket])
    socket.emit('joinRoom', roomID);
    function sendMessage() {
        document.getElementById('inp_msg').value = '';
        socket.emit("send_msg", { message: send_message, username: user.username, room: roomID, userImgAddress: user.imgAddress });
        setSendMessage('')
    }
    return (
        <div className='Watch_Video'>
            <div className='live_chat'>
                <h4>Live Chat</h4>
                <p>Room Id: {roomID} </p>
                <div className='messages' ref={messagesEndRef}></div>
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
                    />
                    <button type='submit'>
                        Send <SendIcon />
                    </button>
                </form>

            </div>
        </div>
    )
}
export default Watch_Video