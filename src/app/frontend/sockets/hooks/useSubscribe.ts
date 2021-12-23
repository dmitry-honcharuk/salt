import { Event } from 'app/types/socket';
import { useEffect } from 'react';
import { useSocket } from './useSocket';

export function useSubscribe<Ev extends Event = never>(
  topic: Ev['topic'],
  callback: (payload: Ev['payload']) => void,
): void {
  const socket = useSocket();

  useEffect(() => {
    socket.on(topic, callback as any);

    return () => {
      socket.off(topic, callback as any);
    };
  }, [topic, callback, socket]);
}
