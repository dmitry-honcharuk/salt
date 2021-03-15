import { useEffect } from 'react';
import { Event } from '../events';
import { useSocket } from './useSocket';

export function useSubscribe<Ev extends Event>(
  topic: Ev['topic'],
  callback: (payload: Ev['payload']) => void,
  deps: any[] = [],
) {
  const socket = useSocket();

  useEffect(() => {
    socket.on(topic, callback as any);

    return () => {
      socket.off(topic, callback);
    };
  }, deps);
}
