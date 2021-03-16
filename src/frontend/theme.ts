import Color from 'color';

const MAIN_COLOR = '#abf1d1';

export const theme = {
  colors: {
    main: MAIN_COLOR,
    secondary: '#f4d6cc',
    text: '#3b3b3b',
    nameFieldBorder: '#4b4a4aeb',
    listItemBorder: '#e0e0e0',
    addItemButtonColor: Color(MAIN_COLOR).darken(0.2).string(),
  },
  spacing: { unit: 5 },
} as const;

export type Theme = typeof theme;
