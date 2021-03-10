import { theme } from 'frontend/theme';
import { color } from 'frontend/theme-selectors';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Salt</title>
      </Head>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
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
