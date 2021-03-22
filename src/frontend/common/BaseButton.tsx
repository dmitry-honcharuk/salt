import {
  getColor,
  getLighterColor,
  getSpacePx,
} from 'frontend/theme-selectors';
import styled from 'styled-components';

const COLOR = {
  main: 'main',
  secondary: 'secondary',
} as const;

type Color = keyof typeof COLOR;

export const BaseButton = styled.button<{ color?: Color }>`
  background-color: transparent;
  border: 2px dashed
    ${({ color = COLOR.main, theme }) => getColor(color)({ theme })};
  padding: ${getSpacePx(2)};
  font-size: 1rem;
  text-transform: lowercase;
  transition: 100ms background-color cubic-bezier(0, 0, 0.2, 1);
  cursor: pointer;
  color: ${({ color = COLOR.main, theme }) => getColor(color)({ theme })};

  :focus {
    outline: none;
  }

  :active {
    background-color: ${({ color = COLOR.main, theme }) =>
      getColor(color)({ theme })};
  }

  &[disabled] {
    border-color: ${getLighterColor('text', 2)};
    color: ${getLighterColor('text', 2)};
    cursor: default;
  }
`;
