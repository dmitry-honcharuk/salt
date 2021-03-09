import { List } from 'core/entities/List';
import { NewList } from 'frontend/blocks/NewList';
import { Button } from 'frontend/common/Button';
import { H5 } from 'frontend/common/Typography';
import { post } from 'frontend/services/api';
import { space } from 'frontend/theme-selectors';
import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

export const WelcomeScreen: FunctionComponent = () => {
  const { push } = useRouter();

  const createList = async () => {
    const list = await post<List>('/api/lists', {});

    push(`/${list.id}`);
  };

  return (
    <Root>
      <Content>
        <Title>You don't seem to have any lists yet</Title>
        <CreateButton onClick={createList}>Create a list then!</CreateButton>
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
  margin-bottom: ${space(3)}px;
  text-align: center;
`;

const CreateButton = styled(Button)`
  border-style: dashed;
`;

const Form = styled(NewList)`
  width: 100%;
`;
