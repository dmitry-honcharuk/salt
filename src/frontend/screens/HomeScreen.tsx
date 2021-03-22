import { ArrowRightSquare } from '@styled-icons/bootstrap';
import { ListEntity } from 'core/entities/List';
import { BaseButton } from 'frontend/common/BaseButton';
import { Layout } from 'frontend/common/Layout';
import { H1, H4 } from 'frontend/common/Typography';
import { usePromise } from 'frontend/hooks/usePromise';
import { createList } from 'frontend/services/api/createList';
import {
  getColor,
  getLighterColor,
  getSpaceSet,
} from 'frontend/theme-selectors';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { getDisplayTime } from 'utils/getDisplayTime';

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
        <AddListButton
          onClick={async () => {
            const list = await create();

            push(`/${list.id}`);
          }}
          disabled={pending}
        >
          +
        </AddListButton>
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

const AddListButton = styled(BaseButton)`
  border: 2px dashed ${getColor('addItemButtonColor')};
  color: ${getColor('addItemButtonColor')};
  height: ${getSpaceSet(8)};
  width: ${getSpaceSet(30)};
  font-weight: bold;
  font-size: 25px;
  padding: 0;
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
