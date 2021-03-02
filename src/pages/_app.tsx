import type { AppProps } from 'next/app';
import Head from 'next/head';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { theme } from 'view/theme';
import { color } from 'view/theme-selectors';

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
