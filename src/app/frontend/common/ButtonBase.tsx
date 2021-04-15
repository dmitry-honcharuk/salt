import { getLighterColor } from 'app/frontend/theme-selectors';
import styled from 'styled-components';

export const ButtonBase = styled.button`
  background-color: transparent;
  font-size: 1rem;
  text-transform: lowercase;
  cursor: pointer;
  color: inherit;
  border: none;
  padding: 0;

  :focus {
    outline: none;
  }

  &[disabled] {
    border-color: ${getLighterColor('text', 2)};
    color: ${getLighterColor('text', 2)};
    cursor: default;
  }
`;
