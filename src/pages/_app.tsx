import { SocketContext } from 'frontend/sockets/context';
import { theme } from 'frontend/theme';
import { color } from 'frontend/theme-selectors';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { io } from 'socket.io-client';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SocketContext.Provider
      value={{ socket: io(process.env.NEXT_PUBLIC_SOCKET_URL as string) }}
    >
      <Head>
        <title>Salt</title>
      </Head>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Component {...pageProps} />
      </ThemeProvider>
    </SocketContext.Provider>
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
    color: ${color('text')};
  }
`;

export default MyApp;
