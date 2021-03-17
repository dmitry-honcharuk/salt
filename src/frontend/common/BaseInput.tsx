import styled from 'styled-components';
import { color, lighterColor, spaceSet } from '../theme-selectors';

export const BaseInput = styled.input`
  border: none;
  font-size: 1.3rem;
  padding: ${spaceSet(3, 2)};
  background-color: transparent;
  border-radius: 0;

  color: ${color('text')};

  :focus {
    outline: none;
  }

  &[disabled] {
    color: ${lighterColor('text', 2)};
  }
`;
