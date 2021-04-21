const AUDIENCE = 'salt';

export function isShareToken(token: string): boolean {
  try {
    const [, payload] = token
      .split('.')
      .slice(0, 2)
      .map(atob)
      .map((part) => JSON.parse(part));

    return payload.aud === AUDIENCE;
  } catch (e) {
    return false;
  }
}
