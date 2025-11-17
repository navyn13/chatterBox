# ChatterBox - Modern Real-Time Chat Application

## Overview
ChatterBox is a modern, responsive real-time chat application built with React and Material-UI. It provides a seamless experience for users to create chat rooms, join conversations, and interact with others in real-time through theme-based room categorization.

## Features
- 🎨 Modern, responsive UI with Material-UI components
- 🌓 Dark/Light theme support
- 🔐 Secure authentication system with JWT
- 💬 Real-time chat functionality using Socket.io
- 🏷️ Theme-based room categorization (Crypto, Gaming, Movies, Coding, etc.)
- 📱 Mobile-friendly responsive design
- 👤 User profile management with image uploads
- 🔍 Search and join rooms by Room ID
- 🌐 Public and private room options

## Tech Stack
- **Frontend:**
  - React.js
  - Material-UI (MUI)
  - Socket.io-client
  - Axios
  - React Router

- **Backend:**
  - Node.js
  - Express
  - MongoDB
  - Socket.io
  - JWT Authentication
  - AWS S3 (for image storage)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or cloud instance like MongoDB Atlas)
- AWS S3 account (for profile picture uploads)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd chatterbox
```

2. **Install dependencies**

Install client dependencies:
```bash
cd client
npm install
cd ..
```

Install server dependencies:
```bash
cd server
npm install
cd ..
```

3. **Set up environment variables**

**Server Environment Variables** (`server/.env`):
Create a `.env` file in the `server` directory with the following variables:

```env
# Server Configuration
PORT=4000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/chatterbox
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatterbox

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# AWS S3 Configuration (for profile picture uploads)
AWS_REGION=us-east-1
AWS_ACCESS_KEY=your-aws-access-key
AWS_SECRET_KEY=your-aws-secret-key
AWS_BUCKET_NAME=your-s3-bucket-name

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

**Client Environment Variables** (`client/.env`):
Create a `.env` file in the `client` directory with the following variable:

```env
REACT_APP_SERVER_URL=http://localhost:4000
```

For production, update `REACT_APP_SERVER_URL` to your production server URL.

### Starting the Application

**Option 1: Run Client and Server Separately (Recommended for Development)**

1. **Start the Server:**
```bash
cd server
npm start
# Or for development with auto-reload:
npm run dev
```

The server will run on `http://localhost:4000` (or the PORT specified in your .env file).

2. **Start the Client:**
Open a new terminal window:
```bash
cd client
npm start
```

The client will run on `http://localhost:3000` and automatically open in your browser.

**Option 2: Run Both Simultaneously**

You can use a tool like `concurrently` to run both servers at once. First install it globally:
```bash
npm install -g concurrently
```

Then from the root directory:
```bash
concurrently "cd server && npm run dev" "cd client && npm start"
```

## Usage

1. **Register/Login**: Create a new account or login with existing credentials
2. **Create a Room**: 
   - Choose between Private or Public room
   - For public rooms, set a name, age group, and theme
   - Click "Create Room" to generate a unique Room ID
3. **Join a Room**: 
   - Enter a Room ID in the header search bar, or
   - Browse public rooms by selecting a theme from the dropdown
4. **Chat**: Start chatting in real-time with other users in the room
5. **Share**: Share your Room ID with friends to let them join your chat room

## Project Structure

```
chatterbox/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.js         # Main app component
│   │   └── ...
│   ├── public/            # Static files
│   └── package.json
├── server/                # Node.js backend application
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Express middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── services/        # Business logic services
│   ├── app.js           # Express app entry point
│   └── package.json
└── README.md
```

## API Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/rooms` - Create a new room
- `GET /api/rooms?theme=<theme>` - Get rooms by theme
- `POST /api/profile` - Upload profile picture

## UI Features
- Responsive design that works on all device sizes
- Intuitive navigation with modern Material-UI components
- Smooth animations and transitions
- Accessible color schemes with dark/light mode support
- Clean and organized layout for better user experience
- Real-time connection status indicators
- Modern chat bubble design with message timestamps

## Deployment

### Vercel (Frontend)
The project includes a `vercel.json` configuration file for easy deployment to Vercel.

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `REACT_APP_SERVER_URL` - Your backend server URL
4. Deploy!

### Backend Deployment
Deploy your backend to platforms like:
- Heroku
- Railway
- Render
- AWS EC2
- DigitalOcean

Make sure to update your `CLIENT_URL` environment variable to match your frontend URL.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the ISC License.

## Author
Naveen Krishna Gupta
