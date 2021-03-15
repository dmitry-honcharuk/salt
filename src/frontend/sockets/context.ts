import { createContext } from 'react';
import { Socket } from 'socket.io-client';

type Context = {
  socket: Socket;
};

export const SocketContext = createContext<Context>({} as Context);
