import { useTranslation } from 'next-i18next';
import RightbarItem from './RightbarItem';
import { Container } from '@material-ui/core';
import { Task } from '../entities';
import { styled } from '@mui/material/styles';
import { useUpcomingTasksQuery } from '../lib/graphql/operations/task.graphql';

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

  const { data, loading, error } = useUpcomingTasksQuery();

  return (
    <StyledContainer>
      <Header>{t('upcoming-tasks')}</Header>
      {data &&
        (data.upcomingTasks.length !== 0 ? (
          data.upcomingTasks.map((task) => {
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
      {loading && <Subtext>{t('loading')}</Subtext>}
      {error && <Subtext>{t('error')}</Subtext>}
    </StyledContainer>
  );
};

export default Rightbar;
