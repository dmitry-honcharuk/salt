import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      main: string;
      secondary: string;
      text: string;
      inputBorderIdle: string;
      inputBorderFocused: string;
      inputOptionalLabel: string;
    };
    spacing: {
      unit: number;
    };
  }
}
