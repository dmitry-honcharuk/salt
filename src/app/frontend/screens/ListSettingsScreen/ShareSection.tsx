import { useAuth } from '@ficdev/auth-react';
import copy from 'copy-to-clipboard';
import { FC, useState } from 'react';
import styled from 'styled-components';
import { ListEntity } from '../../../../core/entities/List';
import { ButtonBase } from '../../common/ButtonBase';
import { getShareToken } from '../../services/api/getShareToken';
import { getColor, getSpacePx } from '../../theme-selectors';

export const ShareSection: FC<{ list: ListEntity }> = ({ list }) => {
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareAvailable = isShareAvailable();

  const isCreator = list.creator.id === currentUser?.id;

  if (!isCreator) {
    return null;
  }

  const handleToken = (token: string) => {
    if (!shareAvailable) {
      copy(token);
      return;
    }
  };

  const handleClick = async () => {
    setLoading(true);

    const { token } = await getShareToken(list.id);

    handleToken(token);

    setLoading(false);
    setCopied(true);
  };

  return (
    <Root>
      <Buttons>
        <Button onClick={handleClick} disabled={loading}>
          {copied ? 'copied' : 'copy'}
        </Button>
        {shareAvailable && (
          <Button onClick={handleClick} disabled={loading}>
            share
          </Button>
        )}
      </Buttons>
    </Root>
  );
};

function isShareAvailable(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.share;
}

const Root = styled.div`
  h2 {
    font-size: 1.5em;
  }
`;

const Buttons = styled.div`
  display: flex;
  margin: ${getSpacePx(0, -2)};
`;

const Button = styled(ButtonBase)`
  color: ${getColor('main')};
  padding: ${getSpacePx(2)};
  border: 2px dashed ${getColor('main')};
  display: block;
  width: 100%;
  margin: ${getSpacePx(0, 2)};
`;
