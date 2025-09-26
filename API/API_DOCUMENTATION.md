# Parking Pal API Documentation

## Overview
The Parking Pal API provides endpoints for managing university parking information and spot swapping functionality. It supports four universities: UAB, UA Tuscaloosa, UAH, and Auburn.

## Base URL
```
http://localhost:3000/api
```

## Authentication
Currently, the API uses simple account-based authentication. Users must create accounts to post spots, but parking information is publicly accessible.

## Endpoints

### Health Check
```http
GET /api/health
```
Returns the API status and timestamp.

**Response:**
```json
{
  "status": "OK",
  "message": "Parking Pal API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Universities

#### Get All Universities
```http
GET /api/universities
```
Returns a list of all supported universities.

**Response:**
```json
[
  {
    "id": "ua-birmingham",
    "name": "University of Alabama - Birmingham"
  },
  {
    "id": "ua-tuscaloosa", 
    "name": "University of Alabama - Tuscaloosa"
  },
  {
    "id": "ua-huntsville",
    "name": "University of Alabama - Huntsville"
  },
  {
    "id": "auburn",
    "name": "Auburn University"
  }
]
```

### Parking Information

#### Get Parking Passes for University and User Type
```http
GET /api/parking/{university}/{userType}
```
Returns available parking passes for a specific university and user type.

**Parameters:**
- `university`: University ID (ua-birmingham, ua-tuscaloosa, ua-huntsville, auburn)
- `userType`: User type (residential, commuter, faculty-staff, student)

**Example:**
```http
GET /api/parking/ua-birmingham/residential
```

**Response:**
```json
{
  "university": "University of Alabama - Birmingham",
  "userType": "residential",
  "passes": [
    {
      "id": "FallSpring – Zone A or Zone H",
      "name": "FallSpring – Zone A or Zone H"
    },
    {
      "id": "Fall (only) – Zone A or Zone H",
      "name": "Fall (only) – Zone A or Zone H"
    }
  ]
}
```

#### Get Specific Parking Information
```http
GET /api/parking/{university}/{userType}/{passType}
```
Returns detailed parking information for a specific pass type.

**Parameters:**
- `university`: University ID
- `userType`: User type
- `passType`: Specific pass type ID

**Example:**
```http
GET /api/parking/ua-birmingham/residential/FallSpring%20–%20Zone%20A%20or%20Zone%20H
```

**Response:**
```json
{
  "university": "University of Alabama - Birmingham",
  "userType": "residential",
  "passType": "FallSpring – Zone A or Zone H",
  "data": {
    "images": [
      "FallSpring – Zone A or Zone H1.jpeg",
      "FallSpring – Zone A or Zone H2.jpeg"
    ],
    "title": "UAB Zone A/H Parking Map (Fall/Spring)"
  }
}
```

### User Management

#### Create User Account
```http
POST /api/users
```
Creates a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "carModel": "Honda Civic",
  "carColor": "Silver"
}
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "carModel": "Honda Civic",
  "carColor": "Silver",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

#### Get User by Name
```http
GET /api/users/{name}
```
Returns user information by name.

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "carModel": "Honda Civic",
  "carColor": "Silver",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

#### Get All Users
```http
GET /api/users
```
Returns all registered users.

### Spot Swap

#### Post Available Spot
```http
POST /api/spots
```
Posts a new available parking spot.

**Request Body:**
```json
{
  "accountName": "John Doe",
  "campus": "ua-birmingham",
  "location": "FallSpring – Zone A or Zone H",
  "timeWait": "5",
  "message": "Orange Magnolia Parking Deck, 3rd floor"
}
```

**Response:**
```json
{
  "id": "456e7890-e89b-12d3-a456-426614174001",
  "accountName": "John Doe",
  "campus": "ua-birmingham",
  "location": "FallSpring – Zone A or Zone H",
  "timeWait": 5,
  "message": "Orange Magnolia Parking Deck, 3rd floor",
  "carModel": "Honda Civic",
  "carColor": "Silver",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "expiresAt": "2024-01-15T10:35:00.000Z",
  "isActive": true
}
```

#### Get All Available Spots
```http
GET /api/spots
```
Returns all currently available spots.

#### Search for Matching Spots
```http
GET /api/spots/search?campus={campus}&location={location}
```
Searches for spots matching specific criteria.

**Example:**
```http
GET /api/spots/search?campus=ua-birmingham&location=FallSpring%20–%20Zone%20A%20or%20Zone%20H
```

#### Claim a Spot
```http
PUT /api/spots/{id}/claim
```
Marks a spot as claimed (no longer available).

**Response:**
```json
{
  "id": "456e7890-e89b-12d3-a456-426614174001",
  "accountName": "John Doe",
  "campus": "ua-birmingham",
  "location": "FallSpring – Zone A or Zone H",
  "timeWait": 5,
  "message": "Orange Magnolia Parking Deck, 3rd floor",
  "carModel": "Honda Civic",
  "carColor": "Silver",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "expiresAt": "2024-01-15T10:35:00.000Z",
  "isActive": false,
  "claimedAt": "2024-01-15T10:32:00.000Z"
}
```

#### Get Spot by ID
```http
GET /api/spots/{id}
```
Returns a specific spot by its ID.

#### Delete Spot
```http
DELETE /api/spots/{id}
```
Deletes a spot from the system.

#### Get User's Spots
```http
GET /api/users/{name}/spots
```
Returns all spots posted by a specific user.

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "All fields are required"
}
```

### 404 Not Found
```json
{
  "error": "User not found"
}
```

### 409 Conflict
```json
{
  "error": "User already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Something went wrong!"
}
```

## Usage Examples

### Frontend Integration

#### JavaScript Example - Getting Parking Information
```javascript
// Get parking passes for UAB residential students
fetch('/api/parking/ua-birmingham/residential')
  .then(response => response.json())
  .then(data => {
    console.log('Available passes:', data.passes);
  });

// Get specific parking information
fetch('/api/parking/ua-birmingham/residential/FallSpring%20–%20Zone%20A%20or%20Zone%20H')
  .then(response => response.json())
  .then(data => {
    console.log('Parking images:', data.data.images);
    console.log('Title:', data.data.title);
  });
```

#### JavaScript Example - Spot Swapping
```javascript
// Create a user account
fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    carModel: 'Honda Civic',
    carColor: 'Silver'
  })
})
.then(response => response.json())
.then(user => console.log('User created:', user));

// Post an available spot
fetch('/api/spots', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    accountName: 'John Doe',
    campus: 'ua-birmingham',
    location: 'FallSpring – Zone A or Zone H',
    timeWait: '5',
    message: 'Orange Magnolia Parking Deck, 3rd floor'
  })
})
.then(response => response.json())
.then(spot => console.log('Spot posted:', spot));

// Search for matching spots
fetch('/api/spots/search?campus=ua-birmingham&location=FallSpring%20–%20Zone%20A%20or%20Zone%20H')
  .then(response => response.json())
  .then(spots => console.log('Matching spots:', spots));
```

## Installation and Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. For development with auto-restart:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## Data Models

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  carModel: string;
  carColor: string;
  createdAt: string;
}
```

### Spot
```typescript
interface Spot {
  id: string;
  accountName: string;
  campus: string;
  location: string;
  timeWait: number;
  message: string;
  carModel: string;
  carColor: string;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
  claimedAt?: string;
}
```

### Parking Data
```typescript
interface ParkingData {
  images: string[];
  title: string;
  source?: string;
}
```
