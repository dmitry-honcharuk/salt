import { io } from 'socket.io-client';
import { Event } from 'types/socket';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string);

export function emit<Ev extends Event>(
  topic: Ev['topic'],
  payload: Ev['payload'],
) {
  return socket.emit(topic, payload);
}
