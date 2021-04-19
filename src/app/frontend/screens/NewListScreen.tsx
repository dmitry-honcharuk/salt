import { useRouter } from 'next/router';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { ListEntity } from '../../../core/entities/List';
import { Actions } from '../common/Actions';
import { BackLink } from '../common/BackLink';
import { Layout } from '../common/Layout';
import { usePromise } from '../hooks/usePromise';
import { createList } from '../services/api/createList';
import { getColor, getSpaceSet } from '../theme-selectors';
import {put} from "../../implementations/services/request-client";
import {participateInList} from "../services/api/participateInList";

type Form = {
  name?: string;
  token?: string;
};

export const NewListScreen: FC = () => {
  const { register, handleSubmit } = useForm<Form>();
  const [create, { pending }] = usePromise<ListEntity, { name?: string }>(
    ({ name }) => createList({ name }),
  );
  const { push } = useRouter();

  const onSubmit = async ({ token, name }: Form) => {
    if (!token) {
      const list = await create({ name });

      await push(`/${list.id}`);

      return;
    }

    const {listId} = await participateInList(token);
    await push(`/${listId}`);
  };

  return (
    <Layout>
      <Header>
        <BackLink />
        <Actions items={[]} />
      </Header>
      <Main>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type='text' placeholder='Name' {...register('name')} />
          <input type='text' placeholder='Token' {...register('token')} />
          <button type='submit' disabled={pending}>
            Create some shit
          </button>
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

const Main = styled.main``;
