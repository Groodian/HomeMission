import { Container, styled } from '@mui/material';
import { useTranslation } from 'next-i18next';
import RightbarItem from './RightbarItem';
import { Task } from '../entities';
import { useOpenTasksQuery } from '../lib/graphql/operations/task.graphql';

const StyledContainer = styled(Container)({
  paddingTop: '2em',
  position: 'sticky',
  top: 0,
  borderLeft: '1px solid gray',
  height: '100%',
});
const Header = styled('h3')({
  textAlign: 'center',
});
const Subtext = styled('p')(({ theme }) => ({
  color: theme.palette.text.secondary,
  textAlign: 'center',
}));

const Rightbar = () => {
  const { t } = useTranslation('common', { keyPrefix: 'Rightbar' });
  const { t: ct } = useTranslation('common');

  const { data, loading, error } = useOpenTasksQuery();

  return (
    <StyledContainer>
      <Header>{t('open-tasks')}</Header>
      {data &&
        (data.openTasks.length !== 0 ? (
          data.openTasks.map((task) => {
            return (
              <RightbarItem
                key={task.id}
                task={task as Task}
                picture={task.assignee?.picture}
                recurring={task.series !== null}
              />
            );
          })
        ) : (
          <Subtext>{t('no-text-info')}</Subtext>
        ))}
      {loading && <Subtext>{ct('loading')}</Subtext>}
      {error && <Subtext>{t('error-message')}</Subtext>}
    </StyledContainer>
  );
};

export default Rightbar;
