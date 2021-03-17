import { color, lighterColor, space } from 'frontend/theme-selectors';
import styled from 'styled-components';

export const BaseButton = styled.button`
  background-color: transparent;
  border: 3px solid ${color('main')};
  padding: ${space(2)}px;
  font-size: 1rem;
  text-transform: lowercase;
  transition: 100ms background-color cubic-bezier(0, 0, 0.2, 1);
  cursor: pointer;
  color: inherit;

  :focus {
    outline: none;
  }

  :active {
    background-color: ${color('main')};
  }

  &[disabled] {
    border-color: ${lighterColor('text', 2)};
    color: ${lighterColor('text', 2)};
    cursor: default;
  }
`;
