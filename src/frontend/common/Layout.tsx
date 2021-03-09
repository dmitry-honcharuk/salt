import { spaceSet } from 'frontend/theme-selectors';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

export const Layout: FunctionComponent = ({ children }) => {
  return <Root>{children}</Root>;
};

const Root = styled.div`
  padding: ${spaceSet(2)};
`;
