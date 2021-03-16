import { ArrowRightSquare } from '@styled-icons/bootstrap';
import { ListEntity } from 'core/entities/List';
import { Button } from 'frontend/common/Button';
import { Layout } from 'frontend/common/Layout';
import { H1, H4 } from 'frontend/common/Typography';
import { createList } from 'frontend/services/api/createList';
import { color, lighterColor, spaceSet } from 'frontend/theme-selectors';
import Link from 'next/link';
import { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import { getDisplayTime } from 'utils/getDisplayTime';

export type Props = {
  lists: ListEntity[];
};

export const HomeScreen: FunctionComponent<Props> = ({ lists: rawLists }) => {
  const [lists, setLists] = useState(
    rawLists.map(({ id, name, createdAt }) => ({ id, name, createdAt })),
  );

  return (
    <Layout>
      <Header>
        <H1 as={H4}>All Lists</H1>
        <AddListButton
          onClick={async () => {
            const list = await createList();

            setLists((lists) => [...lists, list]);
          }}
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
  padding: ${spaceSet(2, 1)};
  border-bottom: 1px dotted ${color('listItemBorder')};
  margin-bottom: ${spaceSet(5)};
  display: flex;
  justify-content: space-between;
`;

const AddListButton = styled(Button)`
  border: 2px dashed ${color('addItemButtonColor')};
  color: ${color('addItemButtonColor')};
  height: ${spaceSet(8)};
  width: ${spaceSet(30)};
  font-weight: bold;
  font-size: 25px;
  padding: 0;
`;

const Ul = styled.ul`
  margin: ${spaceSet(4, 0)};
  font-size: 20px;
`;

const ListItem = styled.li`
  border: 1px dashed ${color('listItemBorder')};

  margin: ${spaceSet(5, 0)};
`;

const ListLink = styled.a<{ pale?: boolean }>`
  color: ${({ pale, theme }) =>
    pale ? lighterColor('text', 0.8)({ theme }) : color('text')({ theme })};
  text-decoration: none;
  display: flex;

  padding: ${spaceSet(4, 4)};
`;

const ListLabel = styled.span`
  padding-right: ${spaceSet(3)};
  display: flex;
  align-items: center;
  flex-grow: 1;
`;

const ArrowIcon = styled(ArrowRightSquare)`
  color: ${lighterColor('text', 1)};
  min-width: 30px;
  height: 30px;
`;
