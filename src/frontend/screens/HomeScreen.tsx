import { List } from 'core/entities/List';
import Link from 'next/link';
import { FunctionComponent } from 'react';
import { WelcomeScreen } from './WelcomeScreen';

export type Props = {
  lists: List[];
};

export const HomeScreen: FunctionComponent<Props> = ({ lists }) => {
  if (!lists.length) {
    return <WelcomeScreen />;
  }

  return (
    <>
      <h1>Well hello there </h1>
      <ul>
        {lists.map(({ id, name }) => (
          <li key={id}>
            <Link href={`/${id}`}>{name || id}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};
