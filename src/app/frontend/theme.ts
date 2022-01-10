const MAIN_COLOR = '#008080';

export const theme = {
  colors: {
    main: MAIN_COLOR,
    secondary: '#e58869',
    white: '#fff',
    text: '#3b3b3b',
    nameFieldBorder: '#4b4a4aeb',
    listItemBorder: '#e0e0e0',
    addItemButtonColor: MAIN_COLOR,
    grey: '#616161',
  },
  spacing: { unit: 5 },
  radius: '5px',
} as const;

export type Theme = typeof theme;
