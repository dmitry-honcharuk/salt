import { getLighterColor } from 'app/frontend/theme-selectors';
import styled from 'styled-components';

export const ButtonBase = styled.button<{ fullWidth?: boolean }>`
  background-color: transparent;
  font-size: 1rem;
  text-transform: lowercase;
  cursor: pointer;
  color: inherit;
  border: none;
  padding: 0;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};

  :focus {
    outline: none;
  }

  &[disabled] {
    border-color: ${getLighterColor('text', 2)};
    color: ${getLighterColor('text', 2)};
    cursor: default;
  }
`;
