import { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import { NewListForm } from 'view/blocks/NewListForm';
import { Button } from 'view/common/Button';
import { H5 } from 'view/common/Typography';
import { space } from 'view/theme-selectors';

export const WelcomeScreen: FunctionComponent = () => {
  const [formVisible, setFormVisibility] = useState(false);

  return (
    <Root>
      {!formVisible && (
        <>
          <Title>You don't seem to have any lists yet</Title>
          <CreateButton onClick={() => setFormVisibility(true)}>
            Create a list then!
          </CreateButton>
        </>
      )}
      {formVisible && <Form />}
    </Root>
  );
};

const Root = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Title = styled(H5)`
  margin-bottom: ${space(3)}px;
`;

const CreateButton = styled(Button)`
  border-style: dashed;
`;

const Form = styled(NewListForm)`
  max-width: 500px;
`;
