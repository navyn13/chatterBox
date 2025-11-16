# Use a lighter, modern Node version
FROM node:20-slim

# Set working directory inside the container
WORKDIR /app

# Copy only server package files first (better caching)
COPY server/package*.json ./server/

# Install backend dependencies
RUN cd server && npm install --production

# Copy full server code
COPY server ./server

# Expose backend port (change if your server uses another port)
EXPOSE 5000

# Start server
CMD ["npm", "start", "--prefix", "server"]
