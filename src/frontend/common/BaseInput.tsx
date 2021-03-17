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
    -webkit-text-fill-color: ${lighterColor('text', 2)};
    color: ${lighterColor('text', 2)};
    opacity: 1;
  }
`;
