import { useAuth } from '@ficdev/auth-react';
import format from 'date-fns/format';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import styled from 'styled-components';
import { ListEntity } from '../../../../core/entities/List';
import { Actions } from '../../common/Actions';
import { BackLink } from '../../common/BackLink';
import { ButtonBase } from '../../common/ButtonBase';
import { Header } from '../../common/Header';
import { Layout } from '../../common/Layout';
import { removeList } from '../../services/api/removeList';
import { getColor, getSpacePx } from '../../theme-selectors';
import { ShareSection } from './ShareSection';

export const ListSettingsScreen: FC<{ list: ListEntity }> = ({ list }) => {
  const { id, participants = [], creator } = list;
  const { user: currentUser } = useAuth();
  const [isDeleting, setDeleting] = useState(false);
  const { push } = useRouter();

  const isCreator = creator.id === currentUser?.id;

  return (
    <Layout>
      <Header>
        <BackLink href={`/${id}`} />
        <Actions />
      </Header>
      <Main>
        {isCreator && (
          <Section>
            <SectionTitle>
              <span>invite code</span>
            </SectionTitle>
            <ShareSection list={list} />
          </Section>
        )}
        {!isCreator && creator.displayName && (
          <Section>
            <SectionTitle>
              <span>creator</span>
            </SectionTitle>
            <User>
              <span>{creator.displayName}</span>
            </User>
          </Section>
        )}
        <Section>
          <SectionTitle>
            <span>
              {participants.length ? 'participants' : 'no participants yet'}
            </span>
          </SectionTitle>
          <ul>
            {participants.map(({ id, displayName, joinedAt }) => (
              <User key={id}>
                <span>
                  <span>{displayName ?? 'Unnamed person'}</span>
                </span>
                {joinedAt && <Date>{format(joinedAt, 'PPP')}</Date>}
              </User>
            ))}
          </ul>
        </Section>
        {isCreator && (
          <Section>
            <DangerSectionTitle>Danger zone</DangerSectionTitle>
            <DeleteButton
              fullWidth
              disabled={isDeleting}
              color='secondary'
              onClick={async () => {
                setDeleting(true);
                await removeList({ listId: id });
                await push('/');
              }}
            >
              remove
            </DeleteButton>
          </Section>
        )}
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

const DangerSectionTitle = styled(SectionTitle)`
  color: ${getColor('secondary')};
`;

const Section = styled.div`
  margin-top: ${getSpacePx(8)};

  :first-child {
    margin-top: 0;
  }
`;

const User = styled.li`
  display: flex;
  justify-content: space-between;
  padding: ${getSpacePx(3)};
  border: 2px dashed ${getColor('grey')};
  margin-top: ${getSpacePx(3)};

  :first-child {
    margin-top: 0;
  }
`;

const Date = styled.span`
  color: ${getColor('grey')};
`;

const DeleteButton = styled(ButtonBase)`
  color: ${getColor('secondary')};
  padding: ${getSpacePx(2)};
  font-size: 1.3em;
  border: 2px dashed ${getColor('secondary')};
`;
