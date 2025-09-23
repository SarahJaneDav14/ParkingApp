const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory storage (in production, use a database)
let users = [];
let availableSpots = [];
let parkingData = {
  'ua-birmingham': {
    name: 'University of Alabama - Birmingham',
    residential: {
      'FallSpring – Zone A or Zone H': {
        images: ['FallSpring – Zone A or Zone H1.jpeg', 'FallSpring – Zone A or Zone H2.jpeg'],
        title: 'UAB Zone A/H Parking Map (Fall/Spring)'
      },
      'Fall (only) – Zone A or Zone H': {
        images: ['Fall (only) – Zone A or Zone H1.jpeg', 'Fall (only) – Zone A or Zone H2.jpeg'],
        title: 'UAB Zone A/H Parking Map (Fall Only)'
      },
      'FallSpring – Zone D9A': {
        images: ['FallSpring – Zone D9A.jpeg'],
        title: 'UAB Zone D9A Parking Map'
      },
      'FallSpring – Zone B': {
        images: ['FallSpring – Zone B.jpeg'],
        title: 'UAB Zone B Parking Map (Fall/Spring)'
      },
      'Fall (only) – Zone B': {
        images: ['Fall (only) – Zone B.jpeg'],
        title: 'UAB Zone B Parking Map (Fall Only)'
      },
      'FallSpring – Zone D, E, F, G': {
        images: ['FallSpring – Zone D, E, F, G1.jpeg', 'FallSpring – Zone D, E, F, G2.jpeg', 'FallSpring – Zone D, E, F, G3.jpeg', 'FallSpring – Zone D, E, F, G4.jpeg'],
        title: 'UAB Zone D, E, F, G Parking Map (Fall/Spring)'
      }
    },
    commuter: {
      'Fall (only) – Zone D, E, F, G': {
        images: ['Fall (only) – Zone D, E, F, G1.jpeg', 'Fall (only) – Zone D, E, F, G2.jpeg', 'Fall (only) – Zone D, E, F, G3.jpeg', 'Fall (only) – Zone D, E, F, G4.jpeg'],
        title: 'UAB Commuter Zone D, E, F, G Parking Map (Fall Only)'
      },
      'FallSpring – Zone C': {
        images: ['FallSpring – Zone C.jpeg'],
        title: 'UAB Commuter Zone C Parking Map (Fall/Spring)'
      },
      'Fall (only) – Zone C': {
        images: ['Fall (only) – Zone C.jpeg'],
        title: 'UAB Commuter Zone C Parking Map (Fall Only)'
      }
    },
    facultyStaff: {
      'fs-parking': {
        images: ['Employee parking.jpeg'],
        title: 'UAB Faculty/Staff Parking Map'
      }
    }
  },
  'ua-tuscaloosa': {
    name: 'University of Alabama - Tuscaloosa',
    residential: {
      'orange': {
        images: ['Orange Parking.png'],
        title: 'UA Tuscaloosa Orange Parking Map'
      },
      'silver': {
        images: ['Silver Parking.png'],
        title: 'UA Tuscaloosa Silver Parking Map'
      },
      'tan': {
        images: ['Tan Parking.png'],
        title: 'UA Tuscaloosa Tan Parking Map'
      },
      'yellow': {
        images: ['Yellow Parking1.png', 'Yellow Parking2.png'],
        title: 'UA Tuscaloosa Yellow Parking Map'
      }
    },
    commuter: {
      'east-commuter': {
        images: ['East Commuter.png', 'East Commuter2.png', 'East Commuter3.png', 'East Commuter4.png', 'East Commuter5.png'],
        title: 'UA Tuscaloosa East Commuter Parking Map'
      },
      'west-commuter': {
        images: ['West Commuter.png'],
        title: 'UA Tuscaloosa West Commuter Parking Map'
      }
    },
    facultyStaff: {
      'fs-parking': {
        images: ['FS Parking.png', 'FS Parking2.png', 'FS Parking3.png', 'FS Parking4.png', 'FS Parking5.png', 'FS Parking6.png'],
        title: 'UA Tuscaloosa Faculty/Staff Parking Map'
      }
    }
  },
  'ua-huntsville': {
    name: 'University of Alabama - Huntsville',
    residential: {
      images: ['ParkingKey.jpg', 'ResParking 1.jpg', 'ResParking2.jpg'],
      title: 'UAH Residential Parking',
      source: 'https://www.uah.edu/images/map/050922/UAH-parking-map-050922.pdf'
    },
    commuter: {
      images: ['ParkingKey.jpg', 'ComParking 1.jpg', 'ComParking 2.jpg'],
      title: 'UAH Commuter Parking',
      source: 'https://www.uah.edu/images/map/050922/UAH-parking-map-050922.pdf'
    },
    facultyStaff: {
      images: ['ParkingKey.jpg', 'FacParking 1.jpg', 'FacParking 2.jpg'],
      title: 'UAH Faculty/Staff Parking',
      source: 'https://www.uah.edu/images/map/050922/UAH-parking-map-050922.pdf'
    }
  },
  'auburn': {
    name: 'Auburn University',
    student: {
      'c-zone': {
        images: ['Auburn C-zone.png'],
        title: 'Auburn C-ZONE Parking Map'
      },
      'pc': {
        images: ['Auburn PC zone.png'],
        title: 'Auburn PC Parking Map'
      },
      'rd': {
        images: ['Auburn RD zone.png'],
        title: 'Auburn RD Parking Map'
      },
      'rh': {
        images: ['Auburn RH zone.png'],
        title: 'Auburn RH Parking Map'
      },
      'ro': {
        images: ['Auburn RO zone.png'],
        title: 'Auburn RO Parking Map'
      },
      'rw': {
        images: ['Auburn RW zone.png'],
        title: 'Auburn RW Parking Map'
      }
    },
    facultyStaff: {
      'a-zone': {
        images: ['Auburn A-zone.png'],
        title: 'Auburn A-ZONE Parking Map'
      },
      'b-zone': {
        images: ['Auburn B-zone.png'],
        title: 'Auburn B-ZONE Parking Map'
      }
    }
  }
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Parking Pal API is running',
    timestamp: new Date().toISOString()
  });
});

// Get all universities
app.get('/api/universities', (req, res) => {
  const universities = Object.keys(parkingData).map(key => ({
    id: key,
    name: parkingData[key].name
  }));
  res.json(universities);
});

// Get parking information for a specific university and pass type
app.get('/api/parking/:university/:userType/:passType', (req, res) => {
  const { university, userType, passType } = req.params;
  
  if (!parkingData[university]) {
    return res.status(404).json({ error: 'University not found' });
  }
  
  const universityData = parkingData[university];
  let passData = null;
  
  if (university === 'ua-huntsville') {
    // UAH has different structure
    if (userType === 'residential' && universityData.residential) {
      passData = universityData.residential;
    } else if (userType === 'commuter' && universityData.commuter) {
      passData = universityData.commuter;
    } else if (userType === 'faculty-staff' && universityData.facultyStaff) {
      passData = universityData.facultyStaff;
    }
  } else if (university === 'auburn') {
    // Auburn has student/faculty-staff structure
    if (userType === 'student' && universityData.student) {
      passData = universityData.student[passType];
    } else if (userType === 'faculty-staff' && universityData.facultyStaff) {
      passData = universityData.facultyStaff[passType];
    }
  } else {
    // UAB and UA Tuscaloosa have residential/commuter/facultyStaff structure
    if (userType === 'residential' && universityData.residential) {
      passData = universityData.residential[passType];
    } else if (userType === 'commuter' && universityData.commuter) {
      passData = universityData.commuter[passType];
    } else if (userType === 'faculty-staff' && universityData.facultyStaff) {
      passData = universityData.facultyStaff[passType];
    }
  }
  
  if (!passData) {
    return res.status(404).json({ error: 'Parking pass type not found' });
  }
  
  res.json({
    university: universityData.name,
    userType,
    passType,
    data: passData
  });
});

// Get all available parking passes for a university and user type
app.get('/api/parking/:university/:userType', (req, res) => {
  const { university, userType } = req.params;
  
  if (!parkingData[university]) {
    return res.status(404).json({ error: 'University not found' });
  }
  
  const universityData = parkingData[university];
  let passes = [];
  
  if (university === 'ua-huntsville') {
    // UAH doesn't have specific pass types
    if (userType === 'residential' && universityData.residential) {
      passes = [{ id: 'residential', name: 'Residential' }];
    } else if (userType === 'commuter' && universityData.commuter) {
      passes = [{ id: 'commuter', name: 'Commuter' }];
    } else if (userType === 'faculty-staff' && universityData.facultyStaff) {
      passes = [{ id: 'faculty-staff', name: 'Faculty/Staff' }];
    }
  } else if (university === 'auburn') {
    // Auburn has student/faculty-staff structure
    if (userType === 'student' && universityData.student) {
      passes = Object.keys(universityData.student).map(key => ({
        id: key,
        name: key.toUpperCase()
      }));
    } else if (userType === 'faculty-staff' && universityData.facultyStaff) {
      passes = Object.keys(universityData.facultyStaff).map(key => ({
        id: key,
        name: key.toUpperCase()
      }));
    }
  } else {
    // UAB and UA Tuscaloosa have residential/commuter/facultyStaff structure
    if (userType === 'residential' && universityData.residential) {
      passes = Object.keys(universityData.residential).map(key => ({
        id: key,
        name: key
      }));
    } else if (userType === 'commuter' && universityData.commuter) {
      passes = Object.keys(universityData.commuter).map(key => ({
        id: key,
        name: key
      }));
    } else if (userType === 'faculty-staff' && universityData.facultyStaff) {
      passes = Object.keys(universityData.facultyStaff).map(key => ({
        id: key,
        name: key
      }));
    }
  }
  
  res.json({
    university: universityData.name,
    userType,
    passes
  });
});

// User Management Endpoints

// Create a new user account
app.post('/api/users', (req, res) => {
  const { name, email, carModel, carColor } = req.body;
  
  if (!name || !email || !carModel || !carColor) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  // Check if user already exists
  const existingUser = users.find(user => 
    user.email.toLowerCase() === email.toLowerCase() || 
    user.name.toLowerCase() === name.toLowerCase()
  );
  
  if (existingUser) {
    return res.status(409).json({ error: 'User already exists' });
  }
  
  const newUser = {
    id: uuidv4(),
    name,
    email,
    carModel,
    carColor,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
});

// Get user by name
app.get('/api/users/:name', (req, res) => {
  const { name } = req.params;
  const user = users.find(u => u.name.toLowerCase() === name.toLowerCase());
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});

// Get all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Spot Swap Endpoints

// Post a new available spot
app.post('/api/spots', (req, res) => {
  const { accountName, campus, location, timeWait, message } = req.body;
  
  if (!accountName || !campus || !location || !timeWait) {
    return res.status(400).json({ error: 'All required fields must be provided' });
  }
  
  // Check if user exists
  const user = users.find(u => u.name.toLowerCase() === accountName.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'User account not found' });
  }
  
  const newSpot = {
    id: uuidv4(),
    accountName,
    campus,
    location,
    timeWait: parseInt(timeWait),
    message: message || '',
    carModel: user.carModel,
    carColor: user.carColor,
    createdAt: new Date().toISOString(),
    expiresAt: moment().add(parseInt(timeWait), 'minutes').toISOString(),
    isActive: true
  };
  
  availableSpots.push(newSpot);
  
  // Clean up expired spots
  cleanupExpiredSpots();
  
  res.status(201).json(newSpot);
});

// Get all available spots
app.get('/api/spots', (req, res) => {
  cleanupExpiredSpots();
  const activeSpots = availableSpots.filter(spot => spot.isActive);
  res.json(activeSpots);
});

// Find matching spots
app.get('/api/spots/search', (req, res) => {
  const { campus, location } = req.query;
  
  if (!campus || !location) {
    return res.status(400).json({ error: 'Campus and location are required' });
  }
  
  cleanupExpiredSpots();
  const matchingSpots = availableSpots.filter(spot => 
    spot.campus === campus && 
    spot.location === location &&
    spot.isActive &&
    moment(spot.expiresAt).isAfter(moment())
  );
  
  res.json(matchingSpots);
});

// Claim a spot (mark as inactive)
app.put('/api/spots/:id/claim', (req, res) => {
  const { id } = req.params;
  const spot = availableSpots.find(s => s.id === id);
  
  if (!spot) {
    return res.status(404).json({ error: 'Spot not found' });
  }
  
  if (!spot.isActive) {
    return res.status(400).json({ error: 'Spot is no longer available' });
  }
  
  if (moment(spot.expiresAt).isBefore(moment())) {
    return res.status(400).json({ error: 'Spot has expired' });
  }
  
  spot.isActive = false;
  spot.claimedAt = new Date().toISOString();
  
  res.json(spot);
});

// Get spot by ID
app.get('/api/spots/:id', (req, res) => {
  const { id } = req.params;
  const spot = availableSpots.find(s => s.id === id);
  
  if (!spot) {
    return res.status(404).json({ error: 'Spot not found' });
  }
  
  res.json(spot);
});

// Delete a spot
app.delete('/api/spots/:id', (req, res) => {
  const { id } = req.params;
  const spotIndex = availableSpots.findIndex(s => s.id === id);
  
  if (spotIndex === -1) {
    return res.status(404).json({ error: 'Spot not found' });
  }
  
  availableSpots.splice(spotIndex, 1);
  res.json({ message: 'Spot deleted successfully' });
});

// Get spots by user
app.get('/api/users/:name/spots', (req, res) => {
  const { name } = req.params;
  const userSpots = availableSpots.filter(spot => 
    spot.accountName.toLowerCase() === name.toLowerCase()
  );
  
  res.json(userSpots);
});

// Helper function to clean up expired spots
function cleanupExpiredSpots() {
  const now = moment();
  availableSpots = availableSpots.filter(spot => 
    moment(spot.expiresAt).isAfter(now)
  );
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚗 Parking Pal API server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
