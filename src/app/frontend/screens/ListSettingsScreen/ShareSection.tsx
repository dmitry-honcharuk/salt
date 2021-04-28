import copy from 'copy-to-clipboard';
import { FC, useState } from 'react';
import styled from 'styled-components';
import { ListEntity } from '../../../../core/entities/List';
import { ButtonBase } from '../../common/ButtonBase';
import { getShareToken } from '../../services/api/getShareToken';
import { getColor, getSpacePx } from '../../theme-selectors';

export const ShareSection: FC<{ list: ListEntity }> = ({ list }) => {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState('');

  const shareAvailable = isShareAvailable();

  const fetchCode = async () => {
    setLoading(true);

    const { token } = await getShareToken(list.id);

    setLoading(false);
    setCode(token);
  };

  const handleCopy = async () => {
    copy(code);
    setCopied(true);
  };

  const handleShare = () => {
    navigator.share({ text: code });
  };

  const actions = code ? (
    <>
      <Button onClick={handleCopy}>{copied ? 'copied' : 'copy'}</Button>
      {shareAvailable && <Button onClick={handleShare}>share</Button>}
    </>
  ) : (
    <Button onClick={fetchCode} disabled={loading}>
      get invite code
    </Button>
  );

  return (
    <Root>
      <Buttons>{actions}</Buttons>
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
