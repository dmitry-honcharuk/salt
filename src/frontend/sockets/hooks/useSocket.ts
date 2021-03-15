import { useContext } from 'react';
import { io } from 'socket.io-client';
import { SocketContext } from '../context';

export function useSocket() {
  const { socket } = useContext(SocketContext);

  return socket ?? io(process.env.NEXT_PUBLIC_SOCKET_URL as string);
}
