import "./Home.css";
import "./Header.css";
import React, { useState } from "react";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate, Link } from "react-router-dom";
import { useStateValue } from './StateProvider'
import { color, fontFamily } from "@mui/system";
import { v4 as uuidv4 } from 'uuid';
import Video_thumbnail from "./Video_thumbnail";
function Home() {
  const navigate = useNavigate();
  function goLive() {
    const myUUID = uuidv4();
    navigate(`watch?room=${myUUID}`)
  }
  return (
    <div className="Home">
      <div className="home_intro">
        <h1>Welcome to our Chat App!</h1>
        <p>Connect with friends, join chat rooms, and start chatting!</p>
        <div className="tutorial">
          <h3>How to get started: </h3>
          <p>Step1: Login/Signup </p>
          <p>Step2: Join room using Room ID/ Create Room</p>
          <p>Step3: Room Id is in url parameters</p>
          <p>Step4: ENJOY CHATTING!!!</p>
          <div className="btn_live">
        <button onClick={goLive}>Create Room</button>
      </div>
        </div>
      </div>
      <img id="home_img" src="https://img.freepik.com/free-photo/full-shot-people-use-apps-make-friends_23-2150575197.jpg?w=1480&t=st=1707546890~exp=1707547490~hmac=da62745c01eb0e84e31027e9deb0a6474792a288f39e94a7ef71319e98d7dd02"></img>
    </div>
    
  );
}
export default Home;
