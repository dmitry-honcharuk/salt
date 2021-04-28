import { Arrow90degLeft } from '@styled-icons/bootstrap/Arrow90degLeft';
import Link from 'next/link';
import { FC } from 'react';
import styled from 'styled-components';
import { getLighterColor, getSpaceSet } from '../theme-selectors';

type Props = {
  href?: string;
};

export const BackLink: FC<Props> = ({ href = '/' }) => {
  return (
    <Link href={href}>
      <StyledBackLink href={href}>
        <Arrow90degLeft height={24} />
      </StyledBackLink>
    </Link>
  );
};

const StyledBackLink = styled.a`
  border: 2px dashed ${getLighterColor('text', 2)};
  color: ${getLighterColor('text', 2)};
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${getSpaceSet(9)};
  width: ${getSpaceSet(9)};
  cursor: pointer;
`;
