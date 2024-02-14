import "./Header.css";
import React, { useState } from "react";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate, Link } from "react-router-dom";
import { useStateValue } from './StateProvider'
import { color, fontFamily } from "@mui/system";
import { v4 as uuidv4 } from 'uuid';
function Header() {
  const [{ user, isAuth }, dispatch] = useStateValue();
  const navigate = useNavigate();
  const[roomId, setRoomId] = useState('')
  function logout() {
    localStorage.removeItem('jwtToken');
    dispatch({
      type: "SET_USER",
      isAuth: false,
    })
  }
  function searchVideo() {
    if(roomId!=""){
      navigate(`watch?room=${roomId}`)
    }
  }
  function goLive() {
    const myUUID = uuidv4();
    navigate(`watch?room=${myUUID}`)
  }

  return (
    <div className="Header">
      <Link to={"/"} style={{ textDecoration: "none" }}><div className="logo">
        <img
          src="https://i.imgur.com/m6GZ6jx.png"
          alt="logo"
        ></img>
      </div></Link>
      <div className="search_box">
        <input className="search_bar" onChange={(e) => { setRoomId(e.target.value) }} placeholder="room Id"></input>
        <button onClick={searchVideo}>Search</button>
      </div>
      
      <div className="features">
        <div className="notification">
          <NotificationsActiveRoundedIcon style={{ color: "white" }}></NotificationsActiveRoundedIcon>
        </div>
        <div className="theme">
          <SettingsBrightnessIcon style={{ color: "white" }}></SettingsBrightnessIcon>
        </div>
        <div className="profile">
          {user ? <div className="channel_pic">
            <img onClick={logout} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdyTh5ljvubR6s3LeERqK8DHldWwD3DcwBLw&usqp=CAU"></img>
          </div> : <Link to={"/signup"} style={{ textDecoration: "none" }}><PersonIcon style={{ color: "white" }}></PersonIcon></Link>}
        </div>
      </div>
    </div>
  );
}
export default Header;
