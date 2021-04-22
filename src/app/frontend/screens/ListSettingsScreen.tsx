import { format } from 'date-fns';
import { FC, useState } from 'react';
import styled from 'styled-components';
import { ListEntity } from '../../../core/entities/List';
import { getShareToken } from '../services/api/getShareToken';

export const ListSettingsScreen: FC<{ list: ListEntity }> = ({ list }) => {
  const [token, setToken] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const { participants = [], creator } = list;

  const handleClick = async () => {
    setLoading(true);

    const { token } = await getShareToken(list.id);

    setToken(token);
    setLoading(false);
  };

  return (
    <>
      <h1>Settings</h1>
      <h2>Share</h2>
      <button onClick={handleClick} disabled={loading}>
        click
      </button>
      <div>{token}</div>
      <hr />
      <Table>
        <thead>
          <tr>
            <th>id</th>
            <th>role</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{creator.id}</td>
            <td>Creator</td>
            <td>N/A</td>
          </tr>
          {participants.map(({ id, joinedAt }) => (
            <tr key={id}>
              <td>{id}</td>
              <td>Participant</td>
              <td>{joinedAt ? format(joinedAt, 'PPP') : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

const Table = styled.table`
  th {
    text-align: left;
  }
  th,
  td {
    padding: 10px;
    border: 1px solid black;
  }
`;
