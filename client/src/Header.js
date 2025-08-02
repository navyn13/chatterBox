import "./Header.css";
import React, { useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate, Link } from "react-router-dom";
import { useStateValue } from './StateProvider'
import { v4 as uuidv4 } from 'uuid';

function Header() {
  const [{ user, isAuth }, dispatch] = useStateValue();
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [theme, setTheme] = useState('');

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

  function goLive() {
    const myUUID = uuidv4();
    navigate(`watch?room=${myUUID}`);
  }

  return (
    <div className="Header">
      <Link to={'/'} style={{ textDecoration: "none" }}>
        <div className="logo">
          <img
            src="https://i.imgur.com/oN050gi.png"
            alt="logo"
          ></img>
        </div>
      </Link>

      <div className="search_box">
        <input
          className="search_bar"
          onChange={(e) => {
            setRoomId(e.target.value);
          }}
          placeholder="room Id"
        ></input>
        <button onClick={searchVideo}>Search</button>
        <select
          className="theme_dropdown"
          value={theme}
          onChange={(e) => {
            if (e.target.value) {
              navigate(`/rooms?theme=${e.target.value}`);
            }
          }}
        >
          <option value="">Select Theme</option>
          <option value="crypto">Crypto</option>
          <option value="gaming">Gaming</option>
          <option value="movies">Movies</option>
          <option value="coding">Coding</option>
          <option value="studying">Studying</option>
          <option value="hangout">Hangout</option>
          <option value="chill">Chill</option>
          <option value="travelling">Travelling</option>
        </select>

      </div>

      <div className="features">
        <div className="profile">
          {user ? (
            <div className="channel_pic">
              <img onClick={logout} src={user.imgAddress}></img>
            </div>
          ) : (
            <Link to={"/signup"} style={{ textDecoration: "none" }}>
              <PersonIcon style={{ color: "white" }}></PersonIcon>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
