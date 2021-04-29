import { Event } from 'app/types/socket';
import { useCallback } from 'react';
import { useSocket } from './useSocket';

type Emit = <Ev extends Event = never>(
  topic: Ev['topic'],
  payload: Ev['payload'],
) => void;

export function useEmit(): Emit {
  const socket = useSocket();

  return useCallback(
    <Ev extends Event = never>(topic: Ev['topic'], payload: Ev['payload']) => {
      socket.emit(topic, payload);
    },
    [socket],
  );
}
