import { useAuth } from '@ficdev/auth-react';
import { Logout } from '@styled-icons/material/Logout';
import { MoreVert as MoreIcon } from '@styled-icons/material/MoreVert';
import { useRouter } from 'next/router';
import { FC, ReactNode } from 'react';
import PopupBase from 'reactjs-popup';
import styled from 'styled-components';
import {
  getColor,
  getLighterColor,
  getRadius,
  getSpacePx,
} from '../theme-selectors';
import { BaseButton } from './BaseButton';
import { ButtonBase } from './ButtonBase';

type Props = {
  items?: ReactNode[];
};

export const Actions: FC<Props> = ({ items = [] }) => {
  const { logout } = useAuth();
  const { push } = useRouter();

  const handleLogout = async () => {
    logout();
    await push('/dashboard');
  };

  return (
    <Popup
      trigger={
        <OptionsButton color="text">
          <OptionsIcon />
        </OptionsButton>
      }
      position="left top"
      offsetX={-45}
      closeOnDocumentClick
      mouseEnterDelay={0}
      arrow={false}
    >
      <ul>
        {items.map((item, index) => (
          <Item key={index}>{item}</Item>
        ))}
        <Item>
          <Button onClick={handleLogout}>
            <Icon as={Logout} /> <span>logout</span>
          </Button>
        </Item>
      </ul>
    </Popup>
  );
};

const Popup = styled(PopupBase)`
  &-content {
    background-color: ${getColor('white')};
    border: 1px solid ${getLighterColor('text', 2)};
    box-shadow: 0px 3px 3px -2px rgb(0 0 0 / 20%),
      0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%);
  }
`;

const OptionsButton = styled(BaseButton)`
  padding: ${getSpacePx()};
  border-radius: ${getRadius()};
`;

const OptionsIcon = styled(MoreIcon)`
  height: ${getSpacePx(6)};
  color: inherit;
`;

const Item = styled.li`
  :last-child {
    border-top: 2px dashed ${getLighterColor('text', 2.5)};
  }
`;

export const Button = styled(ButtonBase)`
  width: 100%;
  padding: ${getSpacePx(2, 3)};
  display: flex;
  align-items: center;
  font-size: 1.3em;
`;

export const Icon = styled.svg`
  height: 25px;
  margin-right: ${getSpacePx(3)};
`;
