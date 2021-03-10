import { Arrow90degLeft } from '@styled-icons/bootstrap/Arrow90degLeft';
import { List } from 'core/entities/List';
import { Button } from 'frontend/common/Button';
import { Layout } from 'frontend/common/Layout';
import { color, lighterColor, space, spaceSet } from 'frontend/theme-selectors';
import Link from 'next/link';
import { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import { Item } from './Item';

type Props = {
  list: List;
  toggleItem: (id: string) => () => Promise<void>;
  updateContent: (id: string) => (content: string) => void;
  addItem: () => Promise<void>;
};

export const ListScreen: FunctionComponent<Props> = ({
  list,
  toggleItem,
  updateContent,
  addItem,
}) => {
  const { items } = list;
  const [created, setCreated] = useState(false);

  return (
    <Layout>
      <Header>
        <Link href='/'>
          <BackLink href='/'>
            <Arrow90degLeft height={20} />
          </BackLink>
        </Link>
        <AddItemButton
          onClick={async () => {
            await addItem();
            setCreated(true);
          }}
        >
          +
        </AddItemButton>
      </Header>
      <Ul>
        {items.map(({ id, content, done }, index) => (
          <ListItem key={id}>
            <Item
              id={id}
              content={content}
              done={done}
              onToggle={toggleItem(id)}
              onItemChange={updateContent(id)}
              focused={created && index === items.length - 1}
            />
          </ListItem>
        ))}
      </Ul>
    </Layout>
  );
};

const Ul = styled.ul`
  margin: ${spaceSet(4, 0)};
  font-size: 20px;
`;

const ListItem = styled.li`
  border-top: 1px dashed ${color('listItemBorder')};

  :first-child {
    border-top: none;
  }
`;

const Header = styled.header`
  padding: ${spaceSet(2, 1)};
  border-bottom: 1px dotted ${color('listItemBorder')};
  margin-bottom: ${spaceSet(5)};
  display: flex;
  justify-content: space-between;
`;

const AddItemButton = styled(Button)`
  border: 2px dashed ${color('addItemButtonColor')};
  color: ${color('addItemButtonColor')};
  height: ${space(8)}px;
  width: ${space(30)}px;
  font-weight: bold;
  font-size: 25px;
  padding: 0;
`;

const BackLink = styled.a`
  border: 2px dashed ${lighterColor('text', 2)};
  color: ${lighterColor('text', 2)};
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${spaceSet(8)};
  width: ${spaceSet(8)};
  cursor: pointer;
`;
