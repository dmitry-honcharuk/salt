export const sleep = (t = 1000): Promise<void> =>
  new Promise((r) => setTimeout(r, t));
