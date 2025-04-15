'use client';

import { IMessageEvent, w3cwebsocket as W3CWebSocket } from 'websocket';
// import { receiveMessage } from '@/store/chatSlice';
import { getCookie } from 'cookies-next';
import { AppDispatch } from '@store/store';
import { setWebSocketMessage } from '../redux/slices/Chat';

let socket: W3CWebSocket | null = null;
let dispatch: AppDispatch;
let reconnectAttempts = 0;
let reconnectTimer: ReturnType<typeof setTimeout>;

const MAX_RECONNECT_ATTEMPTS = 5;

export const initWebSocketStore = (storeDispatch: AppDispatch) => {
  dispatch = storeDispatch;
};

export const WebSocketService = (): void => {
  if (socket) return;
  const AUTH_TOKEN = getCookie('accessToken');
  const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

  if (!AUTH_TOKEN) {
    console.warn('🛑 No token found, socket not connected');
    return;
  }

  if (SOCKET_URL && AUTH_TOKEN) {
    socket = new W3CWebSocket(SOCKET_URL, ['authorization', AUTH_TOKEN]);

    socket.onopen = () => {
      console.log('✅ WebSocket connected');
      reconnectAttempts = 0;
    };

    socket.onmessage = (event: IMessageEvent) => {
      try {
        const data = JSON.parse(event.data as string);
        dispatch(setWebSocketMessage(data));
      } catch (err) {
        console.log(err);
        console.error('❌ Invalid message format:', event.data);
      }
    };

    socket.onerror = (error: unknown) => {
      console.log(error);

      console.error('⚠️ WebSocket error:', (error as Error).message);
    };

    socket.onclose = () => {
      console.log('🔌 WebSocket disconnected');
      socket = null;

      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++;
        const delay = 1000 * reconnectAttempts;
        console.log(`⏳ Reconnecting in ${delay / 1000}s...`);
        reconnectTimer = setTimeout(() => WebSocketService(), delay);
      } else {
        console.warn('🚫 Max reconnect attempts reached.');
      }
    };
  }
};

export const sendSocketMessage = (payload: unknown): void => {
  if (socket && socket?.readyState === socket.OPEN) {
    socket.send(JSON.stringify(payload));
  } else {
    console.warn('⚠️ WebSocket not connected');
  }
};

export const disconnectSocket = (): void => {
  if (reconnectTimer) clearTimeout(reconnectTimer);
  if (socket) {
    socket.close();
    socket = null;
  }
};
