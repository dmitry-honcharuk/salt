import { useAuth } from '@ficdev/auth-react';
import { CleaningServices } from '@styled-icons/material/CleaningServices';
import { Tune } from '@styled-icons/material/Tune';
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
import { Actions, Button, Icon } from '../common/Actions';
import { BackLink } from '../common/BackLink';
import { DraggableList } from '../common/DraggableList';
import { Header } from '../common/Header';
import { LinkBase } from '../common/LinkBase';
import { Item } from './Item';
import { NewItemRow } from './NewItemRow';

type Props = {
  listId: string;
  items: DisplayableItem[];
  toggleItem: (id: string) => () => Promise<void>;
  updateContent: (id: string) => (content: string) => void;
  removeItem: (id: string) => () => void;
  addItem: (params?: Partial<Omit<ItemEntity, 'id'>>) => Promise<void>;
  name?: string;
  setName: (name: string) => void;
  clean: () => Promise<void>;
  createdAt: number;
  creatorId: string;
  handleOrderChange: (ids: string[]) => void;
};

export const ListScreen: FunctionComponent<Props> = ({
  listId,
  items,
  toggleItem,
  updateContent,
  removeItem,
  addItem,
  setName,
  clean,
  name,
  createdAt,
  creatorId,
  handleOrderChange,
}) => {
  const { user: currentUser } = useAuth();
  const [pendingClean, setPendingClean] = useState(false);

  const doneCount = items.filter(({ done }) => done).length;

  const handleClean = async () => {
    setPendingClean(true);
    await clean();
    setPendingClean(false);
  };

  const settingsLink = (
    <Link href={`/${listId}/settings`}>
      <Button href={`/${listId}/settings`} as={LinkBase}>
        <Icon as={Tune} />
        <span>settings</span>
      </Button>
    </Link>
  );

  const removeDone = (
    <CleanButton
      onClick={handleClean}
      disabled={pendingClean || doneCount === 0}
    >
      <Icon as={CleaningServices} />
      <span>clean</span>
    </CleanButton>
  );

  return (
    <Layout>
      <Header>
        <BackLink />
        <NameWrapper>
          <NameInput
            placeholder={getDisplayTime(createdAt)}
            value={name}
            onChange={({ target }) => setName(target.value)}
            disabled={currentUser?.id !== creatorId}
          />
        </NameWrapper>
        <Actions items={[settingsLink, removeDone]} />
      </Header>
      <NewItemRow onCreate={addItem} />
      <DraggableList
        items={items.map((item) => ({
          ...item,
          key: item.id ?? item.displayId,
        }))}
        onDragEnd={(items) => {
          handleOrderChange(items.map((item) => item.id || item.displayId));
        }}
        renderItem={({ id, displayId, content, done }) => (
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
        )}
      />
    </Layout>
  );
};

const ListItem = styled.div`
  border-top: 1px dashed ${getColor('listItemBorder')};

  :first-child {
    border-top: none;
  }
`;

const NameWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const NameInput = styled.input`
  color: ${getLighterColor('text', 1)};
  border: none;
  border-bottom: ${(p) =>
    p.disabled ? 'none' : `1px dashed ${getColor('nameFieldBorder')(p)}`};
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

  :disabled {
    background-color: transparent;
    -webkit-text-fill-color: inherit;
    color: inherit;
    opacity: 1;
  }
`;

const CleanButton = styled(Button)`
  color: ${getColor('secondary')};
  padding-bottom: ${getSpacePx(3)};
`;
