import { useContext } from 'react';
import { SocketContext } from '../context';

export function useSocket() {
  const { socket } = useContext(SocketContext);

  return socket;
}
