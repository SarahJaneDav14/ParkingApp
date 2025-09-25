# Parking Pal API

A comprehensive REST API for the Parking Pal application that provides parking information for multiple universities and enables spot swapping functionality.

## Features

- 🏫 **Multi-University Support**: UAB, UA Tuscaloosa, UAH, and Auburn
- 🅿️ **Parking Information**: Detailed parking maps and pass information
- 🔄 **Spot Swapping**: Post and claim available parking spots
- 👥 **User Management**: Account creation and management
- ⏰ **Real-time Expiration**: Automatic cleanup of expired spots
- 📱 **RESTful Design**: Clean, intuitive API endpoints

## Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **For development (with auto-restart):**
   ```bash
   npm run dev
   ```

4. **Test the API:**
   - Open `api-test.html` in your browser
   - Or visit `http://localhost:3000/api/health`

## API Endpoints Overview

### 🏥 Health & Info
- `GET /api/health` - API status check
- `GET /api/universities` - List all supported universities

### 🅿️ Parking Information
- `GET /api/parking/{university}/{userType}` - Get parking passes
- `GET /api/parking/{university}/{userType}/{passType}` - Get specific parking info

### 👥 User Management
- `POST /api/users` - Create user account
- `GET /api/users` - Get all users
- `GET /api/users/{name}` - Get user by name

### 🔄 Spot Swapping
- `POST /api/spots` - Post available spot
- `GET /api/spots` - Get all available spots
- `GET /api/spots/search` - Search for matching spots
- `PUT /api/spots/{id}/claim` - Claim a spot
- `DELETE /api/spots/{id}` - Delete a spot

## Example Usage

### Get Parking Information
```javascript
// Get UAB residential parking passes
fetch('/api/parking/ua-birmingham/residential')
  .then(response => response.json())
  .then(data => console.log(data.passes));
```

### Create User Account
```javascript
fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    carModel: 'Honda Civic',
    carColor: 'Silver'
  })
});
```

### Post Available Spot
```javascript
fetch('/api/spots', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    accountName: 'John Doe',
    campus: 'ua-birmingham',
    location: 'FallSpring – Zone A or Zone H',
    timeWait: '5',
    message: 'Orange Magnolia Parking Deck, 3rd floor'
  })
});
```

## Supported Universities

### University of Alabama - Birmingham (UAB)
- **Residential**: Zone-based passes (A/H, B, D9A, D/E/F/G)
- **Commuter**: Zone-based passes (C, D/E/F/G)
- **Faculty/Staff**: FS Parking

### University of Alabama - Tuscaloosa
- **Residential**: Color-based passes (Orange, Silver, Tan, Yellow)
- **Commuter**: East/West Commuter passes
- **Faculty/Staff**: FS Parking (6 images)

### University of Alabama - Huntsville (UAH)
- **Residential**: General residential parking
- **Commuter**: General commuter parking
- **Faculty/Staff**: General faculty/staff parking

### Auburn University
- **Student**: Zone-based passes (C-Zone, PC, RD, RH, RO, RW)
- **Faculty/Staff**: Zone-based passes (A-Zone, B-Zone)

## Data Storage

Currently uses in-memory storage for development. In production, consider using:
- MongoDB
- PostgreSQL
- Redis (for session management)

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Testing

Use the included `api-test.html` file to test all API endpoints interactively, or use tools like:
- Postman
- curl
- Insomnia

## Development

### Project Structure
```
├── server.js              # Main API server
├── package.json           # Dependencies and scripts
├── API_DOCUMENTATION.md   # Detailed API documentation
├── api-test.html         # Interactive API testing interface
└── README_API.md         # This file
```

### Adding New Universities

1. Add university data to the `parkingData` object in `server.js`
2. Follow the existing structure for residential/commuter/facultyStaff
3. Update the universities endpoint response

### Adding New Features

1. Create new routes in `server.js`
2. Update `API_DOCUMENTATION.md`
3. Add test cases to `api-test.html`

## Production Deployment

For production deployment:

1. **Environment Variables:**
   ```bash
   export PORT=3000
   export NODE_ENV=production
   ```

2. **Database Integration:**
   - Replace in-memory storage with database
   - Add connection pooling
   - Implement data persistence

3. **Security:**
   - Add authentication middleware
   - Implement rate limiting
   - Add input validation
   - Use HTTPS

4. **Monitoring:**
   - Add logging
   - Implement health checks
   - Set up monitoring tools

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues:
- Check the API documentation
- Review the test interface
- Open an issue on GitHub

---

**Happy Parking! 🚗**
