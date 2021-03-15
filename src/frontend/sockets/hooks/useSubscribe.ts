import { useEffect } from 'react';
import { Event } from 'types/socket';
import { useSocket } from './useSocket';

export function useSubscribe<Ev extends Event>(
  topic: Ev['topic'],
  callback: (payload: Ev['payload']) => void,
): void {
  const socket = useSocket();

  useEffect(() => {
    socket.on(topic, callback as any);

    return () => {
      socket.off(topic, callback);
    };
  }, [topic, callback, socket]);
}
