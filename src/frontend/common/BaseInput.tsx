import styled from 'styled-components';
import { getColor, getLighterColor, getSpaceSet } from '../theme-selectors';

export const BaseInput = styled.input`
  border: none;
  font-size: 1.3rem;
  padding: ${getSpaceSet(3, 2)};
  background-color: transparent;
  border-radius: 0;

  color: ${getColor('text')};

  :focus {
    outline: none;
  }

  &[disabled] {
    -webkit-text-fill-color: ${getLighterColor('text', 2)};
    color: ${getLighterColor('text', 2)};
    opacity: 1;
  }
`;
