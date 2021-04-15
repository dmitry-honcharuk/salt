import Color from 'color';
import { DefaultTheme } from 'styled-components';

type Props = { theme: DefaultTheme };

export const getColor = (key: keyof DefaultTheme['colors']) => ({
  theme,
}: Props): string => theme.colors[key];

export const getLighterColor = (
  key: keyof DefaultTheme['colors'],
  koef: number,
) => ({ theme }: Props): string =>
  Color(getColor(key)({ theme })).lighten(koef).string();

export const getDarkerColor = (
  key: keyof DefaultTheme['colors'],
  koef: number,
) => ({ theme }: Props): string =>
  Color(getColor(key)({ theme })).darken(koef).string();

export const getSpace = (k = 1) => ({ theme }: Props): number =>
  theme.spacing.unit * k;

export const getSpaceSet = (...k: number[]) => (p: Props): string =>
  k
    .map((k) => getSpace(k)(p))
    .map((space) => `${space}px`)
    .join(' ');

export const getSpacePx = (...multies: (number | string)[]) => (p: Props) =>
  multies.length
    ? multies
        .map((k) => (typeof k === 'number' ? `${getSpace(k)(p)}px` : k))
        .join(' ')
    : getSpacePx(1);
