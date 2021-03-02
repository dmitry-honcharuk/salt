import { List } from 'core/entities/List';
import { FunctionComponent, useState } from 'react';

export type Props = {
  lists: List[];
};

export const HomeScreen: FunctionComponent<Props> = ({ lists }) => {
  const [count, setCount] = useState(0);

  const increment = () => setCount((i) => i + 1);

  return (
    <>
      <h1>Well hello there ({count})</h1>
      <button onClick={increment}>Click</button>
    </>
  );
};
