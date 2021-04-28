import { FC } from 'react';
import styled from 'styled-components';

type Props = {
  screenHeight?: boolean;
  fullWidth?: boolean;
  className?: string;
};

export const Centered: FC<Props> = ({
  screenHeight,
  fullWidth,
  className,
  children,
}) => {
  return (
    <Root className={className} screenHeight={screenHeight}>
      <Content fullWidth={fullWidth}>{children}</Content>
    </Root>
  );
};

const CenteredStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Content = styled(CenteredStyle)<{ fullWidth?: boolean }>`
  width: 90%;

  @media (min-width: 600px) {
    width: ${({ fullWidth }) => (fullWidth ? '100%' : '500px')};
  }
`;

const Root = styled(CenteredStyle)<{ screenHeight?: boolean }>`
  height: ${({ screenHeight }) => (screenHeight ? '100vh' : 'auto')};

  ${Content} {
    transform: translateY(
      ${({ screenHeight }) => (screenHeight ? '-50%' : '0')}
    );
  }
`;
