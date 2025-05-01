

// Hotel configuration
export const HOTEL_CONFIG = {
    floors: 10,
    roomsPerFloor: [10, 10, 10, 10, 10, 10, 10, 10, 10, 7],
    roomNumbering: (floor) => floor < 10 ? floor * 100 + 1 : 1000 + 1
  };
  
  // Initialize room data
export function initializeRooms() {
    const rooms = [];
    for (let floor = 1; floor <= HOTEL_CONFIG.floors; floor++) {
      const floorRooms = [];
      const roomCount = HOTEL_CONFIG.roomsPerFloor[floor - 1];
      const startNumber = HOTEL_CONFIG.roomNumbering(floor);
      
      for (let i = 0; i < roomCount; i++) {
        floorRooms.push({
          number: startNumber + i,
          floor,
          position: i + 1, // 1-based position on floor
          booked: false
        });
      }
      rooms.push(...floorRooms);
    }
    return rooms;
  }

export function findOptimalRooms(rooms, count) {
    // Try to find on single floor first
    for (let floor = 1; floor <= HOTEL_CONFIG.floors; floor++) {
      const floorRooms = rooms.filter(r => 
        r.floor === floor && !r.booked
      ).sort((a, b) => a.position - b.position);
      
      if (floorRooms.length >= count) {
        // Find consecutive rooms if possible
        const consecutive = findConsecutive(floorRooms, count);
        if (consecutive) return consecutive;
        
        // Otherwise return first available rooms on floor
        return floorRooms.slice(0, count);
      }
    }
    
    // If not enough on single floor, find multi-floor solution
    return findMultiFloorSolution(rooms, count);
  }
  
  function findConsecutive(rooms, count) {
    for (let i = 0; i <= rooms.length - count; i++) {
      const consecutive = rooms.slice(i, i + count);
      if (consecutive.every((r, idx) => 
        idx === 0 || r.position === consecutive[idx-1].position + 1
      )) {
        return consecutive;
      }
    }
    return null;
  }
  
  function findMultiFloorSolution(rooms, count) {
    // Sort all available rooms by floor and position
    const available = rooms.filter(r => !r.booked)
      .sort((a, b) => a.floor - b.floor || a.position - b.position);
    
    if (available.length < count) return null;
    
    // Find combination with minimal travel time
    let bestCombination = null;
    let minTravelTime = Infinity;
    
    // Check all possible combinations (simplified for demo)
    for (let i = 0; i <= available.length - count; i++) {
      const combination = available.slice(i, i + count);
      const travelTime = calculateTravelTime(combination);
      
      if (travelTime < minTravelTime) {
        minTravelTime = travelTime;
        bestCombination = combination;
      }
    }
    
    return bestCombination;
  }
  
  function calculateTravelTime(rooms) {
    if (rooms.length === 0) return 0;
    
    // Sort rooms by floor and position
    const sorted = [...rooms].sort((a, b) => 
      a.floor - b.floor || a.position - b.position
    );
    
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    
    // Vertical travel time (between floors)
    const verticalTime = Math.abs(last.floor - first.floor) * 2;
    
    // Horizontal travel time (sum of distances between consecutive rooms)
    let horizontalTime = 0;
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].floor === sorted[i-1].floor) {
        horizontalTime += Math.abs(sorted[i].position - sorted[i-1].position);
      }
    }
    
    return verticalTime + horizontalTime;
  }