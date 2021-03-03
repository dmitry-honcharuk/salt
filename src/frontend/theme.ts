import Color from 'color';
import { DefaultTheme } from 'styled-components';

const MAIN_COLOR = '#abf1d1';

export const theme: DefaultTheme = {
  colors: {
    main: MAIN_COLOR,
    secondary: '#f4d6cc',
    text: '#3b3b3b',
    inputBorderIdle: '#e0e0e0',
    inputBorderFocused: Color(MAIN_COLOR).darken(0.2).string(),
    inputOptionalLabel: '#4b4a4aeb',
  },
  spacing: { unit: 5 },
};
