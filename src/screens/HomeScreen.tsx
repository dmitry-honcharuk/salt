import { List } from 'core/entities/List';
import { FunctionComponent } from 'react';

export type Props = {
  lists: List[];
};

export const HomeScreen: FunctionComponent<Props> = ({ lists }) => {
  return <h1>Well hello there</h1>;
};
