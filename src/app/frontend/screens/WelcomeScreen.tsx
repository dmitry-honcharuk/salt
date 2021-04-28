import { BaseButton } from 'app/frontend/common/BaseButton';
import { H5 } from 'app/frontend/common/Typography';
import { getColor, getSpace } from 'app/frontend/theme-selectors';
import Link from 'next/link';
import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Centered } from '../common/Centered';
import { Layout } from '../common/Layout';
import { LinkBase } from '../common/LinkBase';

export const WelcomeScreen: FunctionComponent = () => {
  return (
    <Layout>
      <Centered screenHeight>
        <Title>You don't seem to have any lists yet</Title>
        <Link href='/new'>
          <Button href='/new' as={LinkBase}>
            Add a list then!
          </Button>
        </Link>
      </Centered>
    </Layout>
  );
};

const Title = styled(H5)`
  margin-bottom: ${getSpace(3)}px;
  text-align: center;
`;

const Button = styled(BaseButton)`
  color: ${getColor('main')};
`;
