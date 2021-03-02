import { FunctionComponent } from 'react';

export const Field: FunctionComponent = () => {
  const [is, set] = useState(false);
  return (
    <>
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
    </>
  );
};
