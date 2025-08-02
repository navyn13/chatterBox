import "./Home.css";
import "./Header.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";

function Home() {
  const navigate = useNavigate();
  const [roomType, setRoomType] = useState("private");
  const [roomName, setRoomName] = useState("");
  const [ageGroup, setAgeGroup] = useState("above 18");
  const [theme, setTheme] = useState("crypto");

  async function goLive() {
    const myUUID = uuidv4();

    if (roomType === "public") {
      try {
        await axios.post("http://localhost:4000/api/rooms", {
          roomId: myUUID,
          name: roomName,
          ageGroup: ageGroup,
          theme: theme
        });
      } catch (err) {
        console.error("Error creating public room:", err);
        return;
      }
    }

    navigate(`watch?room=${myUUID}`);
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
          <p>Step3: Room Id is in URL parameters</p>
          <p>Step4: ENJOY CHATTING!!!</p>

          <div className="room-options">
            <label>
              Room Type: &nbsp;
              <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
            </label>

            {roomType === "public" && (
              <div className="public-room-details">
                <label>
                  Room Name:
                  <input value={roomName} onChange={(e) => setRoomName(e.target.value)} />
                </label>
                <label>
                  Age Group:
                  <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
                    <option value="above 18">Above 18</option>
                    <option value="below 18">Below 18</option>
                  </select>
                </label>
                <label>
                  Theme:
                  <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                    <option value="crypto">Crypto</option>
                    <option value="gaming">Gaming</option>
                    <option value="movies">Movies</option>
                    <option value="coding">Coding</option>
                    <option value="studying">Studying</option>
                    <option value="hangout">Hangout</option>
                    <option value="chill">Chill</option>
                    <option value="travelling">Travelling</option>
                  </select>
                </label>
              </div>
            )}
          </div>

          <div className="btn_live">
            <button onClick={goLive}>Create Room</button>
          </div>
        </div>
      </div>

      <img
        id="home_img"
        src="https://img.freepik.com/free-photo/full-shot-people-use-apps-make-friends_23-2150575197.jpg?w=1480&t=st=1707546890~exp=1707547490~hmac=da62745c01eb0e84e31027e9deb0a6474792a288f39e94a7ef71319e98d7dd02"
      />
    </div>
  );
}

export default Home;
