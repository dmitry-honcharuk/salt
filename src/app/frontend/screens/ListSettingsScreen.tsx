import { FC, useState } from 'react';
import { ListEntity } from '../../../core/entities/List';
import { getShareToken } from '../services/api/getShareToken';

export const ListSettingsScreen: FC<{ list: ListEntity }> = ({ list }) => {
  const [token, setToken] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);

    const { token } = await getShareToken(list.id);

    setToken(token);
    setLoading(false);
  };

  return (
    <>
      <button onClick={handleClick} disabled={loading}>
        click
      </button>
      <div>token - {token}</div>
    </>
  );
};
