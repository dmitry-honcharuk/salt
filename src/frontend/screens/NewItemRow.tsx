import { ItemEntity } from 'core/entities/Item';
import { BaseInput } from 'frontend/common/BaseInput';
import { getColor } from 'frontend/theme-selectors';
import { FunctionComponent, useState } from 'react';
import styled from 'styled-components';

type Props = {
  onCreate: (params?: Partial<Omit<ItemEntity, 'id'>>) => Promise<void>;
};

export const NewItemRow: FunctionComponent<Props> = ({ onCreate }) => {
  const [state, setState] = useState<Omit<ItemEntity, 'id' | 'createdAt'>>({
    content: '',
    done: false,
  });

  const reset = () =>
    setState({
      content: '',
      done: false,
    });

  const create = async () => {
    if (!state.content) {
      return;
    }

    const item = { ...state };
    reset();

    await onCreate(item);
  };

  return (
    <Input
      placeholder='+ new item'
      value={state.content}
      onBlur={create}
      onChange={({ target }) => {
        setState((s) => ({ ...s, content: target.value }));
      }}
      onKeyPress={async ({ code }) => {
        if (code === 'Enter') {
          await create();
        }
      }}
    />
  );
};

const Input = styled(BaseInput)`
  width: 100%;
  border-bottom: 2px dashed ${getColor('main')};
`;
