import { BaseButton } from 'app/frontend/common/BaseButton';
import { H5 } from 'app/frontend/common/Typography';
import { usePromise } from 'app/frontend/hooks/usePromise';
import { createList } from 'app/frontend/services/api/createList';
import { getSpace } from 'app/frontend/theme-selectors';
import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

export const WelcomeScreen: FunctionComponent = () => {
  const { push } = useRouter();
  const [create, { pending }] = usePromise(() => createList());

  const handleCreateList = async () => {
    const list = await create();

    push(`/${list.id}`);
  };

  return (
    <Root>
      <Content>
        <Title>You don't seem to have any lists yet</Title>
        <CreateButton onClick={handleCreateList} disabled={pending}>
          Create a list then!
        </CreateButton>
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
