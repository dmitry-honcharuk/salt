import { NewListForm } from 'frontend/blocks/NewListForm';
import { Button } from 'frontend/common/Button';
import { H5 } from 'frontend/common/Typography';
import { space } from 'frontend/theme-selectors';
import { FunctionComponent, useState } from 'react';
import styled from 'styled-components';

export const WelcomeScreen: FunctionComponent = () => {
  const [formVisible, setFormVisibility] = useState(false);

  return (
    <Root>
      <Content>
        {!formVisible && (
          <>
            <Title>You don't seem to have any lists yet</Title>
            <CreateButton onClick={() => setFormVisibility(true)}>
              Create a list then!
            </CreateButton>
          </>
        )}
        {formVisible && <Form />}
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

const Form = styled(NewListForm)``;
