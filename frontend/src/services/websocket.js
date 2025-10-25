// src/services/websocket.js
import { io } from 'socket.io-client';

// Assume your WebSocket server is also on localhost:3001
const SOCKET_URL = 'http://localhost:3001';

const socket = io(SOCKET_URL, {
  autoConnect: false, // Don't connect automatically
});

// You can export helper functions
export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;