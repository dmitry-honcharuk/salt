export function normalizeQueryParam(param: string | string[]): string {
  return Array.isArray(param) ? param.join() : param;
}
