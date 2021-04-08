import { Arrow90degLeft } from '@styled-icons/bootstrap/Arrow90degLeft';
import { DeleteForever as DeleteIconBase } from '@styled-icons/material/DeleteForever';
import { BaseButton } from 'app/frontend/common/BaseButton';
import { Layout } from 'app/frontend/common/Layout';
import {
  getColor,
  getLighterColor,
  getSpacePx,
  getSpaceSet,
} from 'app/frontend/theme-selectors';
import { DisplayableItem } from 'app/frontend/types/DisplayableItem';
import { getDisplayTime } from 'app/utils/getDisplayTime';
import { ItemEntity } from 'core/entities/Item';
import Link from 'next/link';
import { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import { Item } from './Item';
import { NewItemRow } from './NewItemRow';

type Props = {
  items: DisplayableItem[];
  toggleItem: (id: string) => () => Promise<void>;
  updateContent: (id: string) => (content: string) => void;
  removeItem: (id: string) => () => void;
  removeList: () => Promise<void>;
  addItem: (params?: Partial<Omit<ItemEntity, 'id'>>) => Promise<void>;
  name?: string;
  setName: (name: string) => void;
  createdAt: number;
};

export const ListScreen: FunctionComponent<Props> = ({
  items,
  toggleItem,
  updateContent,
  removeItem,
  removeList,
  addItem,
  setName,
  name,
  createdAt,
}) => {
  const [isDeleting, setDeleting] = useState(false);

  return (
    <Layout>
      <Header>
        <Link href='/'>
          <BackLink href='/'>
            <Arrow90degLeft height={24} />
          </BackLink>
        </Link>
        <NameWrapper>
          <NameInput
            placeholder={getDisplayTime(createdAt)}
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </NameWrapper>
        <DeleteButton
          disabled={isDeleting}
          color='secondary'
          onClick={async () => {
            setDeleting(true);
            await removeList();
          }}
        >
          <DeleteIcon />
        </DeleteButton>
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
              onRemove={removeItem(displayId)}
            />
          </ListItem>
        ))}
      </Ul>
    </Layout>
  );
};

const Ul = styled.ul`
  margin: ${getSpaceSet(4, 0)};
  font-size: 20px;
`;

const ListItem = styled.li`
  border-top: 1px dashed ${getColor('listItemBorder')};

  :first-child {
    border-top: none;
  }
`;

const Header = styled.header`
  padding: ${getSpaceSet(2, 1)};
  border-bottom: 1px dotted ${getColor('listItemBorder')};
  margin-bottom: ${getSpaceSet(5)};
  display: flex;
  justify-content: space-between;
`;

const BackLink = styled.a`
  border: 2px dashed ${getLighterColor('text', 2)};
  color: ${getLighterColor('text', 2)};
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${getSpaceSet(9)};
  width: ${getSpaceSet(9)};
  cursor: pointer;
`;

const NameWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const NameInput = styled.input`
  color: ${getLighterColor('text', 1)};
  border: none;
  border-bottom: 1px dashed ${getColor('nameFieldBorder')};
  border-radius: 0;
  padding: ${getSpaceSet(1, 2)};
  font-size: 1.5rem;
  text-align: right;
  width: calc(100% - 40px);
  margin: 0 auto;
  text-align: center;

  :focus {
    outline: none;
  }
`;

const DeleteButton = styled(BaseButton)`
  padding: ${getSpacePx()};
`;

const DeleteIcon = styled(DeleteIconBase)`
  height: ${getSpacePx(6)};
  color: inherit;
`;
