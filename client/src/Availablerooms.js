import React, { useEffect, useState } from "react";
import "./Availableroom.css";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

function AvailableRooms() {
  const [rooms, setRooms] = useState([]);   
  const location = useLocation();

  useEffect(() => {

    const params = new URLSearchParams(location.search);
    const theme = params.get("theme");
    console.log("Fetching rooms for theme:", theme);

    axios.get(`http://localhost:4000/api/rooms?theme=${theme}` )
      .then((res) => setRooms(res.data.roomsData))
      .catch((err) => console.error("Failed to fetch rooms", err));
  }, [location]);

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
