import { Arrow90degLeft } from '@styled-icons/bootstrap/Arrow90degLeft';
import { ItemEntity } from 'core/entities/Item';
import { Layout } from 'frontend/common/Layout';
import { color, lighterColor, spaceSet } from 'frontend/theme-selectors';
import { DisplayableItem } from 'frontend/types/DisplayableItem';
import Link from 'next/link';
import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { getDisplayTime } from 'utils/getDisplayTime';
import { Item } from './Item';
import { NewItemRow } from './NewItemRow';

type Props = {
  items: DisplayableItem[];
  toggleItem: (id: string) => () => Promise<void>;
  updateContent: (id: string) => (content: string) => void;
  addItem: (params?: Partial<Omit<ItemEntity, 'id'>>) => Promise<void>;
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
  return (
    <Layout>
      <Header>
        <Link href='/'>
          <BackLink href='/'>
            <Arrow90degLeft height={20} />
          </BackLink>
        </Link>
        <NameWrapper>
          <NameInput
            placeholder={getDisplayTime(createdAt)}
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </NameWrapper>
      </Header>
      <NewItemRow onCreate={addItem} />
      <Ul>
        {items.map(({ id, displayId, content, done }) => (
          <ListItem key={displayId}>
            <Item
              pending={!id}
              content={content}
              done={done}
              onToggle={toggleItem(displayId)}
              onItemChange={updateContent(displayId)}
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

const NameInput = styled.input`
  color: ${lighterColor('text', 1)};
  border: none;
  border-bottom: 1px dashed ${color('nameFieldBorder')};
  border-radius: 0;
  padding: ${spaceSet(1, 2)};
  font-size: 1.5rem;
  text-align: right;
  transition: border-color 100ms;

  :focus {
    outline: none;
  }
`;
