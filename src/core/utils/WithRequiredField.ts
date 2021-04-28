export type WithRequiredField<T, F extends keyof T> = Omit<T, F> &
  Required<Pick<T, F>>;
