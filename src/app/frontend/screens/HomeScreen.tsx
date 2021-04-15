import { ArrowRightSquare } from '@styled-icons/bootstrap';
import { PlaylistAdd } from '@styled-icons/material/PlaylistAdd';
import { Layout } from 'app/frontend/common/Layout';
import { H1, H4 } from 'app/frontend/common/Typography';
import { usePromise } from 'app/frontend/hooks/usePromise';
import { createList } from 'app/frontend/services/api/createList';
import {
  getColor,
  getLighterColor,
  getSpaceSet,
} from 'app/frontend/theme-selectors';
import { getDisplayTime } from 'app/utils/getDisplayTime';
import { ListEntity } from 'core/entities/List';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Actions, Button, Icon as IconBase } from '../common/Actions';

export type Props = {
  lists: ListEntity[];
};

export const HomeScreen: FunctionComponent<Props> = ({ lists }) => {
  const { push } = useRouter();
  const [create, { pending }] = usePromise(() => createList());

  return (
    <Layout>
      <Header>
        <H1 as={H4}>All Lists</H1>
        <Actions
          items={[
            <AddListButton
              onClick={async () => {
                const list = await create();

                await push(`/${list.id}`);
              }}
              disabled={pending}
            >
              <AddListIcon as={PlaylistAdd} />
              <span>create list</span>
            </AddListButton>,
          ]}
        />
      </Header>
      <Ul>
        {lists.map(({ id, name, createdAt }) => (
          <ListItem key={id}>
            <Link href={`/${id}`}>
              <ListLink href={`/${id}`} pale={!name}>
                <ListLabel>{name || getDisplayTime(createdAt)}</ListLabel>
                <ArrowIcon />
              </ListLink>
            </Link>
          </ListItem>
        ))}
      </Ul>
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

const AddListButton = styled(Button)`
  color: ${getColor('addItemButtonColor')};
`;

const Ul = styled.ul`
  margin: ${getSpaceSet(4, 0)};
  font-size: 20px;
`;

const ListItem = styled.li`
  border: 1px dashed ${getColor('listItemBorder')};

  margin: ${getSpaceSet(5, 0)};
`;

const ListLink = styled.a<{ pale?: boolean }>`
  color: ${({ pale, theme }) =>
    pale
      ? getLighterColor('text', 0.8)({ theme })
      : getColor('text')({ theme })};
  text-decoration: none;
  display: flex;

  padding: ${getSpaceSet(4, 4)};
`;

const ListLabel = styled.span`
  padding-right: ${getSpaceSet(3)};
  display: flex;
  align-items: center;
  flex-grow: 1;
`;

const ArrowIcon = styled(ArrowRightSquare)`
  color: ${getLighterColor('text', 1)};
  min-width: 30px;
  height: 30px;
`;

const AddListIcon = styled(IconBase)`
  height: 25px;
`;
