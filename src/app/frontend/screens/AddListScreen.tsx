import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { ListEntity } from '../../../core/entities/List';
import { Actions } from '../common/Actions';
import { BackLink } from '../common/BackLink';
import { BaseButton } from '../common/BaseButton';
import { BaseInput } from '../common/BaseInput';
import { Layout } from '../common/Layout';
import { usePromise } from '../hooks/usePromise';
import { createList } from '../services/api/createList';
import { participateInList } from '../services/api/participateInList';
import {
  getColor,
  getLighterColor,
  getSpacePx,
  getSpaceSet,
} from '../theme-selectors';
import { isShareToken } from '../utils/isShareToken';

type Form = {
  input?: string;
};

enum State {
  NewList,
  ExistingList,
}

export const AddListScreen: FC = () => {
  const [state, setState] = useState(State.NewList);
  const { register, handleSubmit, watch } = useForm<Form>();
  const [create, { pending }] = usePromise<ListEntity, { name?: string }>(
    ({ name }) => createList({ name }),
  );
  const { push } = useRouter();

  const input = watch('input');

  useEffect(() => {
    const expectedState =
      !input || !isShareToken(input) ? State.NewList : State.ExistingList;

    if (expectedState !== state) {
      setState(expectedState);
    }
  }, [input, state]);

  const onSubmit = async ({ input }: Form) => {
    try {
      if (!input || state !== State.ExistingList) {
        const list = await create({ name: input });

        await push(`/${list.id}`);

        return;
      }

      const { listId } = await participateInList(input);
      await push(`/${listId}`);
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <Layout>
      <Header>
        <BackLink />
        <Actions items={[]} />
      </Header>
      <Main>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Hint>
            Specify a name for your new list
            <br />
            or paste a code to participate in someone else's list
          </Hint>
          <Input
            type='text'
            placeholder="It's ok to leave it empty"
            {...register('input')}
          />
          <Footer>
            <BaseButton type='submit' color='main' disabled={pending}>
              {state === State.NewList ? 'Create a list' : 'Link to a list'}
            </BaseButton>
          </Footer>
        </form>
      </Main>
    </Layout>
  );
};

const Header = styled.header`
  padding: ${getSpaceSet(2, 1)};
  border-bottom: 1px dotted ${getColor('listItemBorder')};
  margin-bottom: ${getSpaceSet(5)};
  display: flex;
  justify-content: space-between;
`;

const Main = styled.main`
  padding-top: ${getSpacePx(10)};
  font-size: 1rem;
`;

const Hint = styled.p`
  font-size: 1.2em;
  line-height: 1.1;
  margin-bottom: ${getSpacePx(4)};
  color: ${getLighterColor('text', 1)};
`;

const Input = styled(BaseInput)`
  font-size: 1.2em;
  display: block;
  width: 100%;
  color: ${getLighterColor('text', 1)};
  border: 2px dashed ${getLighterColor('text', 2)};
  margin-bottom: ${getSpacePx(7)};
`;

const Footer = styled.footer`
  text-align: right;
`;
