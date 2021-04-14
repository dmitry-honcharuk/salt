import { SocketContext } from 'app/frontend/sockets/context';
import { theme } from 'app/frontend/theme';
import { getColor } from 'app/frontend/theme-selectors';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { io } from 'socket.io-client';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import {
  NEXT_PUBLIC_AUTH_CLIENT_ID,
  NEXT_PUBLIC_SOCKET_URL,
} from '../app/config/env';
import { AuthProvider } from '../app/frontend/auth';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider
      clientId={NEXT_PUBLIC_AUTH_CLIENT_ID}
      audience='http://localhost:3000'
    >
      <SocketContext.Provider value={{ socket: io(NEXT_PUBLIC_SOCKET_URL) }}>
        <Head>
          <title>Salt</title>
        </Head>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <Component {...pageProps} />
        </ThemeProvider>
      </SocketContext.Provider>
    </AuthProvider>
  );
}

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  html {
    font-size: 16px;
  }
  body {
    font-family: 'Roboto', sans-serif;
    color: ${getColor('text')};
  }
`;

export default MyApp;
