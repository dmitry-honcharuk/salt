import { List } from 'core/entities/List';
import { format } from 'date-fns';
import { Button } from 'frontend/common/Button';
import { Field } from 'frontend/common/forms/Field';
import { post } from 'frontend/services/api';
import { space, spaceSet } from 'frontend/theme-selectors';
import { FunctionComponent, useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

type Props = { className?: string };

type FormState = {
  name?: string;
};

export const NewListForm: FunctionComponent<Props> = ({ className }) => {
  const { register, handleSubmit } = useForm<FormState>();
  const [createdList, setCreatedList] = useState<List>();

  const onSubmit = async (data: FormState) => {
    const list = await post<List>('/api/lists', data);

    setCreatedList(list);
  };

  return (
    <>
      {JSON.stringify(createdList)}
      <Form className={className} onSubmit={handleSubmit(onSubmit)}>
        <Field
          id='list-name'
          label='A name for your new list'
          name='name'
          ref={register}
          placeholder={format(new Date(), 'MMMM do, yyyy')}
        />

        <Footer>
          <NextButton type='submit'>Add some items to the list</NextButton>
        </Footer>
      </Form>
    </>
  );
};

const Form = styled.form``;

const Footer = styled.footer`
  margin-top: ${space(3)}px;
  display: flex;
  justify-content: flex-end;
`;

const NextButton = styled(Button)`
  border-style: dashed;
  padding: ${spaceSet(1, 6)};
`;
