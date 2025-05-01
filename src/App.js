import React, { useState } from 'react';
import './App.css';
import { findOptimalRooms, HOTEL_CONFIG, initializeRooms } from './utils';

function Hotel() {
  const [rooms, setRooms] = useState(initializeRooms());
  const [bookedRooms, setBookedRooms] = useState([]);
  const [roomCount, setRoomCount] = useState(1);
  const [message, setMessage] = useState('');
  
  const bookRooms = () => {
    if (roomCount < 1 || roomCount > 5) {
      setMessage('Please enter a number between 1 and 5');
      return;
    }
    
    const optimalRooms = findOptimalRooms(rooms, roomCount);
    
    if (!optimalRooms || optimalRooms.length < roomCount) {
      setMessage('Not enough available rooms');
      return;
    }
    
    // Mark rooms as booked
    const newRooms = [...rooms];
    const booked = [];
    
    optimalRooms.forEach(room => {
      const index = newRooms.findIndex(r => r.number === room.number);
      if (index !== -1) {
        newRooms[index].booked = true;
        booked.push(newRooms[index]);
      }
    });
    
    setRooms(newRooms);
    setBookedRooms([...bookedRooms, ...booked]);
    setMessage(`Booked rooms: ${booked.map(r => r.number).join(', ')}`);
  };
  
  const randomOccupancy = () => {
    const newRooms = [...rooms];
    const occupancyRate = 0.3; // 30% occupied
    
    newRooms.forEach(room => {
      room.booked = Math.random() < occupancyRate;
    });
    
    setRooms(newRooms);
    setMessage('Random occupancy generated');
  };
  
  const resetBookings = () => {
    const newRooms = rooms.map(room => ({
      ...room,
      booked: false
    }));
    
    setRooms(newRooms);
    setBookedRooms([]);
    setMessage('All bookings reset');
  };
  
  // Render hotel visualization
  const renderFloors = () => {
    return [...Array(HOTEL_CONFIG.floors)].map((_, i) => {
      const floor = HOTEL_CONFIG.floors - i; // Render top floor first
      const floorRooms = rooms.filter(r => r.floor === floor);
      
      return (
        <div key={floor} className="floor">
          <div className="floor-label">Floor {floor}</div>
          <div className="rooms">
            {floorRooms.map(room => (
              <div 
                key={room.number}
                className={`room ${room.booked ? 'booked' : 'available'}`}
                title={`Room ${room.number} (${room.booked ? 'Booked' : 'Available'})`}
              >
                {room.number}
              </div>
            ))}
          </div>
        </div>
      );
    });
  };
  
  return (
    <div className="hotel-app">
      <h1>Hotel Room Reservation System</h1>
      
      <div className="controls">
        <div>
          <label>
            Number of rooms to book (1-5):
            <input 
              type="number" 
              min="1" 
              max="5" 
              value={roomCount}
              onChange={(e) => setRoomCount(parseInt(e.target.value))}
            />
          </label>
          <button onClick={bookRooms}>Book Rooms</button>
        </div>
        
        <div>
          <button onClick={randomOccupancy}>Generate Random Occupancy</button>
          <button onClick={resetBookings}>Reset All Bookings</button>
        </div>
      </div>
      
      {message && <div className="message">{message}</div>}
      
      <div className="hotel-visualization">
        <div className="staircase"></div>
        <div className="floors-container">
          {renderFloors()}
        </div>
      </div>
      
      <div className="booked-rooms">
        <h2>Booked Rooms</h2>
        {bookedRooms.length > 0 ? (
          <ul>
            {bookedRooms.map(room => (
              <li key={room.number}>Room {room.number} (Floor {room.floor})</li>
            ))}
          </ul>
        ) : (
          <p>No rooms booked yet</p>
        )}
      </div>
    </div>
  );
}

export default Hotel;