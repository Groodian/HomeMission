import { Container, Typography } from '@material-ui/core';
import { useTranslation } from 'next-i18next';
import { useUpcomingTasksQuery } from '../lib/graphql/operations/task.graphql';
import TaskQuickSelect from './TaskQuickSelect';
import { Task } from '../entities';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Container)({
  paddingTop: '2.5em',
  position: 'sticky',
  top: 0,
  borderLeft: '1px solid gray',
  height: '100%',
});
const StyledText = styled(Typography)({
  fontSize: 16,
  fontWeight: 500,
  color: '#555',
});

const Rightbar = () => {
  const { t } = useTranslation(['RightBar']);

  const { data } = useUpcomingTasksQuery();

  return (
    <StyledContainer>
      <StyledText gutterBottom>{t('upcoming-tasks')}</StyledText>
      {data &&
        data.upcomingTasks.map((task) => {
          return (
            <TaskQuickSelect
              key={task.id}
              task={task as Task}
              _picture={task.assignee?.picture}
              _recurring={task.series !== null}
            />
          );
        })}
    </StyledContainer>
  );
};

export default Rightbar;
