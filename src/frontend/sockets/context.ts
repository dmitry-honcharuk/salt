import { createContext } from 'react';
import { Socket } from 'socket.io-client';

type Context = {
  socket: Socket | null;
};

export const SocketContext = createContext<Context>({
  socket: null,
});
