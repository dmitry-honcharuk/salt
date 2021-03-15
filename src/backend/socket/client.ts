import { io, Socket } from 'socket.io-client';
import { Event } from 'types/socket';

let cachedSocket: Socket | null = null;

export function getSocket() {
  if (cachedSocket) {
    return cachedSocket;
  }

  cachedSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string);

  return cachedSocket;
}

export function emit<Ev extends Event>(
  topic: Ev['topic'],
  payload: Ev['payload'],
) {
  return getSocket().emit(topic, payload);
}
