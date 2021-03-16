import Color from 'color';
import { DefaultTheme } from 'styled-components';

type Props = { theme: DefaultTheme };

export const color = (key: keyof DefaultTheme['colors']) => ({
  theme,
}: Props): string => theme.colors[key];

export const lighterColor = (
  key: keyof DefaultTheme['colors'],
  koef: number,
) => ({ theme }: Props): string =>
  Color(color(key)({ theme })).lighten(koef).string();

export const darkerColor = (
  key: keyof DefaultTheme['colors'],
  koef: number,
) => ({ theme }: Props): string =>
  Color(color(key)({ theme })).darken(koef).string();

export const space = (k = 1) => ({ theme }: Props): number =>
  theme.spacing.unit * k;

export const spaceSet = (...k: number[]) => (p: Props): string =>
  k
    .map((k) => space(k)(p))
    .map((space) => `${space}px`)
    .join(' ');
