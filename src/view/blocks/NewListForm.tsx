import { FunctionComponent, useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { color, space } from 'view/theme-selectors';

type Props = { className?: string };

type FormState = {
  name?: string;
};

export const NewListForm: FunctionComponent<Props> = ({ className }) => {
  const [is, set] = useState(false);
  const { register, handleSubmit } = useForm<FormState>();

  const onSubmit = (data: FormState) => {
    console.log(data);
  };

  return (
    <Form className={className} onSubmit={handleSubmit(onSubmit)}>
      <Label htmlFor='list-name' shifted={is}>
        A name for your new list
      </Label>
      <Input
        type='text'
        name='name'
        id='list-name'
        ref={register}
        autoComplete='off'
        placeholder='[ That tastiest cake ]'
        onFocus={() => set(true)}
        onBlur={() => set(false)}
      />
    </Form>
  );
};

const Form = styled.form`
  width: 100%;
`;
const Label = styled.label<{ shifted: boolean }>`
  display: inline-block;
  margin-bottom: ${space()}px;
  letter-spacing: 1px;
  transform: translateX(${(p) => (p.shifted ? space(4) : 0)}px);
  transition: 100ms transform ease-in-out;
  /* padding-left: ${space(4)}px; */
`;
const Input = styled.input`
  width: 100%;
  padding: ${space(2)}px ${space(3)}px;
  font-size: 1.5rem;
  border: 2px dashed ${color('inputBorderIdle')};
  transition: 200ms border-color ease-in-out;

  &:focus {
    outline: none;
    border-color: ${color('inputBorderFocused')};
  }
`;
