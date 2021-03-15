import { Event } from 'types/socket';
import { useSocket } from './useSocket';

type Emit = <Ev extends Event = never>(
  topic: Ev['topic'],
  payload: Ev['payload'],
) => void;

export function useEmit(): Emit {
  const socket = useSocket();

  function emit<Ev extends Event = never>(
    topic: Ev['topic'],
    payload: Ev['payload'],
  ) {
    socket.emit(topic, payload);
  }

  return emit;
}
