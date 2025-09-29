import React, { useEffect, useState } from "react";
import "./Availableroom.css";
import { Link, useLocation } from "react-router-dom";
import axios from './axios';

function AvailableRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams(location.search);
        const theme = params.get("theme");
        
        if (!theme) {
          setError("Theme parameter is required");
          return;
        }

        const response = await axios.get(`/api/rooms?theme=${theme}`);
        if (response.data.success && Array.isArray(response.data.rooms)) {
          setRooms(response.data.rooms);
        } else {
          setError("Invalid response format from server");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch rooms");
        console.error("Failed to fetch rooms:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [location]);

  if (loading) {
    return <div className="available-rooms">Loading rooms...</div>;
  }

  if (error) {
    return <div className="available-rooms error">{error}</div>;
  }

  return (
    <div className="available-rooms">
      <h2>Available Public Rooms</h2>
      <div className="room-list">
        {rooms && rooms.length > 0 ? (
          rooms.map((room, index) => (
            <div key={room._id || index} className="room-card">
              <h3>{room.name}</h3>
              <p>Age Group: {room.ageGroup}</p>
              <p>Theme: {room.theme}</p>
              <Link to={`/watch?room=${room.roomId}`}>Join Room</Link>
            </div>
          ))
        ) : (
          <p>No rooms available for this theme.</p>
        )}
      </div>
    </div>
  );
}

export default AvailableRooms;
