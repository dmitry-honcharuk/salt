import { color, space } from 'frontend/theme-selectors';
import styled from 'styled-components';

export const Button = styled.button`
  background-color: transparent;
  border: 3px solid ${color('main')};
  padding: ${space(2)}px;
  font-size: 1rem;
  text-transform: lowercase;
  transition: 100ms background-color cubic-bezier(0, 0, 0.2, 1);
  cursor: pointer;
  color: inherit;

  &:focus {
    outline: none;
  }

  &:hover {
    background-color: ${color('main')};
  }
`;
