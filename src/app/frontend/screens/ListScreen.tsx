import { DeleteForever } from '@styled-icons/material/DeleteForever';
import { Tune } from '@styled-icons/material/Tune';
import { Layout } from 'app/frontend/common/Layout';
import {
  getColor,
  getLighterColor,
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
import { LinkBase } from '../common/LinkBase';
import { Item } from './Item';
import { NewItemRow } from './NewItemRow';
import {useAuth} from "@ficdev/auth-react";

type Props = {
  listId: string;
  items: DisplayableItem[];
  toggleItem: (id: string) => () => Promise<void>;
  updateContent: (id: string) => (content: string) => void;
  removeItem: (id: string) => () => void;
  removeList: () => Promise<void>;
  addItem: (params?: Partial<Omit<ItemEntity, 'id'>>) => Promise<void>;
  name?: string;
  setName: (name: string) => void;
  createdAt: number;
  creatorId: string;
};

export const ListScreen: FunctionComponent<Props> = ({
  listId,
  items,
  toggleItem,
  updateContent,
  removeItem,
  removeList,
  addItem,
  setName,
  name,
  createdAt,
  creatorId
}) => {
  const [isDeleting, setDeleting] = useState(false);
  const { user } = useAuth();
  const isCreator = creatorId === user?.id;
    const settingsLink = <Link href={`/${listId}/settings`}>
        <Button href={`/${listId}/settings`} as={LinkBase}>
            <Icon as={Tune}/>
            <span>settings</span>
        </Button>
    </Link>;
    const deleteButton = <DeleteButton
        disabled={isDeleting}
        color='secondary'
        onClick={async () => {
            setDeleting(true);
            await removeList();
        }}
    >
        <Icon as={DeleteForever} />
        <span>remove</span>
    </DeleteButton>;
    const actions = [
      settingsLink,
            ...(isCreator ? [deleteButton] : []) ,
    ];
    return (
    <Layout>
      <Header>
        <BackLink />
        <NameWrapper>
          <NameInput
            placeholder={getDisplayTime(createdAt)}
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </NameWrapper>
        <Actions
          items={actions}
        />
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

const DeleteButton = styled(Button)`
  color: ${getColor('secondary')};
`;
