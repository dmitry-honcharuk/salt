import { BaseButton } from 'app/frontend/common/BaseButton';
import { H5 } from 'app/frontend/common/Typography';
import { getSpace } from 'app/frontend/theme-selectors';
import { useRouter } from 'next/router';
import { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../auth';

export const AuthenticateScreen: FunctionComponent = () => {
  const { authorizeWithRedirect } = useAuth();
  const { replace } = useRouter();
  const [pending, setPending] = useState(false);

  const authorize = () => {
    setPending(true);
    authorizeWithRedirect({
      onSuccess: () => replace('/dashboard'),
    });
  };

  return (
    <Root>
      <Content>
        <Title>
          {pending ? 'Processing...' : 'You need to authenticate to continue'}
        </Title>
        {!pending && (
          <CreateButton onClick={authorize}>Let's do it!</CreateButton>
        )}
      </Content>
    </Root>
  );
};

const Centered = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Root = styled(Centered)`
  height: 100vh;
`;

const Content = styled(Centered)`
  transform: translateY(-50%);
  width: 90%;

  @media (min-width: 600px) {
    width: 500px;
  }
`;

const Title = styled(H5)`
  margin-bottom: ${getSpace(3)}px;
  text-align: center;
`;

const CreateButton = styled(BaseButton)`
  border-style: dashed;
`;
