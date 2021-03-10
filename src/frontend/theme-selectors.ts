import Color from 'color';
import { DefaultTheme } from 'styled-components';

type Props = { theme: DefaultTheme };

export const color = (key: keyof DefaultTheme['colors']) => ({
  theme,
}: Props) => theme.colors[key];

export const lighterColor = (
  key: keyof DefaultTheme['colors'],
  koef: number,
) => ({ theme }: Props) => Color(color(key)({ theme })).lighten(koef).string();

export const space = (k: number = 1) => ({ theme }: Props) =>
  theme.spacing.unit * k;

export const spaceSet = (...k: number[]) => (p: Props) =>
  k
    .map((k) => space(k)(p))
    .map((space) => `${space}px`)
    .join(' ');
