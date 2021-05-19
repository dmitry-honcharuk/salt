import { LoaderOutline } from '@styled-icons/evaicons-outline/LoaderOutline';
import { FC } from 'react';
import styled, { keyframes } from 'styled-components';

export const LoadingScreen: FC = () => {
  return (
    <Root>
      <SpinnerIcon />
    </Root>
  );
};

const spin = keyframes`
  from {
      transform:rotate(0deg);
  }
  to {
      transform:rotate(360deg);
  }
`;

const Root = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SpinnerIcon = styled(LoaderOutline)`
  height: 50px;
  animation: ${spin} 3s linear infinite;
  position: relative;
  top: -15%;
`;
