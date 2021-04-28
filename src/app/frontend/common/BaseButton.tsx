import { getColor, getSpacePx } from 'app/frontend/theme-selectors';
import styled from 'styled-components';
import { ButtonBase } from './ButtonBase';

const COLOR = {
  main: 'main',
  secondary: 'secondary',
  text: 'text',
} as const;

type Color = keyof typeof COLOR;

export const BaseButton = styled(ButtonBase)<{ color?: Color }>`
  border: 2px dashed
    ${({ color = COLOR.main, theme }) => getColor(color)({ theme })};
  padding: ${getSpacePx(2)};
  transition: 100ms background-color cubic-bezier(0, 0, 0.2, 1);
  color: ${({ color = COLOR.main, theme }) => getColor(color)({ theme })};

  :active {
    background-color: ${({ color = COLOR.main, theme }) =>
      getColor(color)({ theme })};
  }
`;
