import { Event } from '../events';
import { useSocket } from './useSocket';

export function useEmit() {
  const socket = useSocket();

  function emit<Ev extends Event>(topic: Ev['topic'], payload: Ev['payload']) {
    socket.emit(topic, payload);
  }

  return emit;
}
