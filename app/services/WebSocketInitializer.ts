'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@store/hooks';
import {
  disconnectSocket,
  initWebSocketStore,
  WebSocketService,
} from '@services/WebSocketService';

export default function WebSocketInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Set dispatch globally
    initWebSocketStore(dispatch);

    // Connect once
    WebSocketService();

    return () => {
      disconnectSocket();
    };
  }, []);

  return null;
}
