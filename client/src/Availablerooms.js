import React, { useEffect, useState } from "react";
import "./Availableroom.css";
import { Link } from "react-router-dom";
import axios from "axios";

function AvailableRooms() {
  const [rooms, setRooms] = useState([]);   

  useEffect(() => {
    console.log("We are goint to find the available rooms lets go")
    axios.get("http://localhost:4000/api/rooms")
      .then((res) => setRooms(res.data.roomsData))
      .catch((err) => console.error("Failed to fetch rooms", err));
  }, []);

  return (
    <div className="available-rooms">
      <h2>Available Public Rooms</h2>
      <div className="room-list">
        {rooms.map((room, index) => (
            <div key={index} className="room-card">
                <h3>{room.name}</h3>
                <p>Age Group: {room.ageGroup}</p>
                <p>Theme: {room.theme}</p>
                <Link to={`/watch?room=${room.roomId}`}>Join Room</Link>
            </div>
        ))}
      </div>
    </div>
  );
}

export default AvailableRooms;
