import format from 'date-fns/format';
import { FC } from 'react';
import styled from 'styled-components';
import { ListEntity } from '../../../../core/entities/List';
import { Actions } from '../../common/Actions';
import { BackLink } from '../../common/BackLink';
import { Header } from '../../common/Header';
import { Layout } from '../../common/Layout';
import { getColor, getSpacePx } from '../../theme-selectors';
import { ShareSection } from './ShareSection';

export const ListSettingsScreen: FC<{ list: ListEntity }> = ({ list }) => {
  const { id, participants = [] } = list;

  return (
    <Layout>
      <Header>
        <BackLink href={`/${id}`} />
        <Actions />
      </Header>
      <Main>
        <Share>
          <SectionTitle>
            <span>invite code</span>
          </SectionTitle>
          <ShareSection list={list} />
        </Share>
        <SectionTitle>
          <span>participants</span>
        </SectionTitle>
        <ul>
          {participants.map(({ id, displayName, joinedAt }) => (
            <User key={id}>
              <span>{displayName ?? 'Unnamed person'}</span>
              {joinedAt && <Date>{format(joinedAt, 'PPP')}</Date>}
            </User>
          ))}
        </ul>
      </Main>
    </Layout>
  );
};

const Main = styled.main`
  h1 {
    font-size: 2.5em;
    font-weight: bold;
  }
`;

const SectionTitle = styled.div`
  font-size: 1.1em;
  margin-bottom: ${getSpacePx(2)};
  color: ${getColor('grey')};
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const Share = styled.div`
  margin-bottom: ${getSpacePx(8)};
`;

const User = styled.li`
  display: flex;
  justify-content: space-between;
  padding: ${getSpacePx(2)};
  border: 2px dashed ${getColor('grey')};
  margin-top: ${getSpacePx(3)};

  :first-child {
    margin-top: 0;
  }
`;

const Date = styled.span`
  color: ${getColor('grey')};
`;
