import { FC } from 'react';
import { ListEntity } from '../../../core/entities/List';

export const ListSettingsScreen: FC<{ list: ListEntity }> = ({ list }) => {
  return <h1>ListSettingsScreen ${JSON.stringify(list)}</h1>;
};
