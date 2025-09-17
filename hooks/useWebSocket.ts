"use client";
import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';

interface WebSocketMessage {
  type: 'notification' | 'rendez_vous_update' | 'demande_update' | 'error';
  data: any;
  timestamp: string;
}

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.id) return;

    // Pour l'instant, on simule des notifications
    // En production, on utiliserait un vrai WebSocket
    const interval = setInterval(() => {
      // Simuler des notifications aléatoires
      const notifications = [
        {
          type: 'notification' as const,
          data: {
            title: 'Nouveau rendez-vous',
            message: 'Un nouveau rendez-vous a été demandé',
            priority: 'medium'
          },
          timestamp: new Date().toISOString()
        },
        {
          type: 'rendez_vous_update' as const,
          data: {
            id: '1',
            statut: 'confirmé',
            client: 'Marie Dubois'
          },
          timestamp: new Date().toISOString()
        }
      ];

      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
      setLastMessage(randomNotification);
    }, 30000); // Toutes les 30 secondes pour les tests

    return () => clearInterval(interval);
  }, [session?.user?.id]);

  const sendMessage = (message: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };

  return {
    isConnected,
    lastMessage,
    sendMessage
  };
}
