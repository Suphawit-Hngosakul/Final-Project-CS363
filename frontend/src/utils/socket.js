import { io } from 'socket.io-client';
import { BASE } from './api';

// Singleton socket connection — แชร์ไปทุก component ที่ต้องการ realtime
let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io(BASE, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
}
