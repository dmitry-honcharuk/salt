import { useCallback, useState } from 'react';

type OptionalSpread<T> = T extends undefined ? [] : [T];

export function usePromise<T, P = undefined>(
  promiseFactory: PerformPromise<P, T>,
): Output<P, T> {
  const [state, setState] = useState<State<T>>({
    result: null,
    pending: false,
  });

  const perform = useCallback(
    async (...params: OptionalSpread<P>) => {
      setState((s) => ({ ...s, pending: true }));

      const result = await promiseFactory(...params);

      setState((s) => ({ ...s, pending: false, result }));

      return result;
    },
    [promiseFactory],
  );

  return [perform, state];
}

type PerformPromise<T, R> = (...params: OptionalSpread<T>) => Promise<R>;
type State<R> = { pending: boolean; result: R | null };

type Output<T, R> = [PerformPromise<T, R>, State<R>];
