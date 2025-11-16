# StreamVista - Modern Video Streaming Platform

## Overview
StreamVista is a modern, responsive video streaming platform built with React and Material-UI. It provides a seamless experience for users to stream, share, and interact with video content in real-time.

## Features
- 🎨 Modern, responsive UI with Material-UI components
- 🌓 Dark/Light theme support
- 🔐 Secure authentication system
- 🎥 Real-time video streaming
- 💬 Live chat functionality
- 🏷️ Theme-based room categorization
- 📱 Mobile-friendly design


## Tech Stack
- Frontend:
  - React.js
  - Material-UI
  - Socket.io-client
  - Axios
  - React Router

- Backend:
  - Node.js
  - Express
  - MongoDB
  - Socket.io
  - JWT Authentication

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd chatterbox
```

2. Install all dependencies (monorepo setup)
```bash
# Install all dependencies from root (workspaces)
npm install
```

3. Set up environment variables
Create `.env` files in the server directory with necessary configurations.

4. Start the development servers
```bash
# Start client (from root directory)
npm run start:client

# Start server (from root directory)
npm run start:server

# Or use dev mode with auto-reload
npm run dev:client
npm run dev:server
```

**Note:** This project uses npm workspaces. All dependencies are installed at the root level, and both client and server share the same `node_modules` directory.

## Usage
1. Register/Login to your account
2. Create a new streaming room or join existing ones
3. Share your room ID with friends to let them join
4. Use the theme selector to find rooms based on interests

## UI Features
- Responsive design that works on all device sizes
- Intuitive navigation with modern Material-UI components
- Smooth animations and transitions
- Accessible color schemes with dark/light mode support
- Clean and organized layout for better user experience

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the ISC License.

## Author
Naveen Krishna Gupta

