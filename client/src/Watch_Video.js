import './Watch_Video.css'
import React, { useState } from "react";
import { useEffect } from 'react';
import io, { Socket } from "socket.io-client"
import { useStateValue } from './StateProvider';
import SendIcon from '@mui/icons-material/Send';
const socket = io('http://localhost:4000');
function Watch_Video() {
    const [{ user }] = useStateValue();
    const [send_message, setSendMessage] = useState('');
    const [recieve_msg, setRecieveMessage] = useState('');
    const queryParams = new URLSearchParams(window.location.search);
    const roomID = queryParams.get('room');
    useEffect(() => {
        const handleReceiveMsg = (data) => {
            console.log(data)
            const div = document.createElement("div");
            const img = document.createElement('img');
            img.src = data.userImgAddress;
            img.style.width = '30px'; // Example: Change width to 50 pixels
            img.style.height = '30px';
            img.style.marginRight='10px'
            img.style.borderRadius='50%';
            div.appendChild(img)
            const textNode = document.createTextNode(data.username + " : " + data.message);
            div.appendChild(textNode);
            div.style.border= '1px solid #000000'
            div.style.marginBottom='2px'
            div.style.backgroundColor='aliceblue'
            document.querySelector('.messages').appendChild(div);
        };

        socket.on('recieve_msg', handleReceiveMsg)
        return () => {
            socket.off('recieve_msg', handleReceiveMsg);
        };
    }, [socket])
    socket.emit('joinRoom', roomID);
    function sendMessage() {
        document.getElementById('inp_msg').value = '';
        socket.emit("send_msg", { message: send_message, username: user.username, room: roomID, userImgAddress: user.imgAddress});
        setSendMessage('')
    }
    return (
        <div className='Watch_Video'>
            <div className='live_chat'>
                <h4>Live Chat</h4>
                <p>Room Id: {roomID} </p>
                <div className='messages'></div>
                <div className='msg_block'>
                    <input id='inp_msg' onChange={(e) => { setSendMessage(e.target.value) }}></input>
                    <button onClick={sendMessage}>Send<SendIcon></SendIcon></button>
                </div>
            </div>
        </div>
    )
}
export default Watch_Video