import { FC } from 'react';
import { ListSettingsScreen } from '../../app/frontend/screens/ListSettingsScreen';
import { ListEntity } from '../../core/entities/List';

const ListSettingsPage: FC<{ list: ListEntity }> = ({ list }) => {
  return <ListSettingsScreen list={list} />;
};

export default ListSettingsPage;

export { getServerSideProps } from './index';
