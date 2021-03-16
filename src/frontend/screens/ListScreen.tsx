import { Arrow90degLeft } from '@styled-icons/bootstrap/Arrow90degLeft';
import { ItemEntity } from 'core/entities/Item';
import { Button } from 'frontend/common/Button';
import { Layout } from 'frontend/common/Layout';
import { color, lighterColor, space, spaceSet } from 'frontend/theme-selectors';
import Link from 'next/link';
import { FunctionComponent, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { getDisplayTime } from 'utils/getDisplayTime';
import { Item } from './Item';

type Props = {
  items: ItemEntity[];
  toggleItem: (id: string) => () => Promise<void>;
  updateContent: (id: string) => (content: string) => void;
  addItem: () => Promise<void>;
  name?: string;
  setName: (name: string) => void;
  createdAt: number;
};

export const ListScreen: FunctionComponent<Props> = ({
  items,
  toggleItem,
  updateContent,
  addItem,
  setName,
  name,
  createdAt,
}) => {
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
      <NameWrapper>
        <NameInput
          placeholder={getDisplayTime(createdAt)}
          value={name}
          onChange={({ target }) => setName(target.value)}
        />
      </NameWrapper>
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

const NameWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const blink = keyframes`
 from {
    border-right: 5px solid black;
  }

  to {
    border-right: 5px solid transparent;
  }
`;

const NameInput = styled.input`
  color: ${lighterColor('text', 1)};
  border: none;
  border-right: 5px solid ${color('nameFieldBorder')};
  border-radius: 0;
  padding: ${spaceSet(1, 2)};
  font-size: 1.5rem;
  text-align: right;
  transition: border-color 100ms;

  :focus {
    outline: none;
    animation: ${blink} 800ms linear alternate infinite;
  }
`;
