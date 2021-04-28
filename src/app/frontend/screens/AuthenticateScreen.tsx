import { useAuth } from '@ficdev/auth-react';
import { BaseButton } from 'app/frontend/common/BaseButton';
import { H5 } from 'app/frontend/common/Typography';
import { getSpace } from 'app/frontend/theme-selectors';
import { useRouter } from 'next/router';
import { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import { Centered } from '../common/Centered';

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
    <Centered screenHeight>
      <Title>
        {pending ? 'Processing...' : 'You need to authenticate to continue'}
      </Title>
      {!pending && (
        <CreateButton onClick={authorize}>Let's do it!</CreateButton>
      )}
    </Centered>
  );
};

const Title = styled(H5)`
  margin-bottom: ${getSpace(3)}px;
  text-align: center;
`;

const CreateButton = styled(BaseButton)`
  border-style: dashed;
`;
