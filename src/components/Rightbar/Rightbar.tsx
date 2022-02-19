import React from 'react';
import { CircularProgress, Container, styled } from '@mui/material';
import { useTranslation } from 'next-i18next';
import RightbarItem from './RightbarItem';
import Task from '../../entities/task';
import { useOpenTasksQuery } from '../../lib/graphql/operations/task.graphql';
import { useSnackbar } from 'notistack';
import StyledDrawer from '../StyledDrawer';
import TaskDetailsDrawer from '../TaskDetailsDrawer';

const Header = styled('h3')({
  textAlign: 'center',
});
const Subtext = styled('p')(({ theme }) => ({
  color: theme.palette.text.secondary,
  textAlign: 'center',
}));

const Rightbar: React.FC = () => {
  const { t } = useTranslation('common', { keyPrefix: 'Rightbar' });
  const { enqueueSnackbar } = useSnackbar();

  const [selectedTask, setSelectedTask] = React.useState<Task | undefined>(
    undefined
  );

  const { data, loading, error } = useOpenTasksQuery();

  // check if selected task needs to be updated
  if (selectedTask && data) {
    // matching task is either same (potentially updated) selected task or undefined if it was deleted
    const matchingTask = data.openTasks.filter(
      (t) => t.id === selectedTask.id
    )[0] as Task | undefined;

    // update selected task if something has changed
    if (matchingTask !== selectedTask) setSelectedTask(matchingTask);
  }

  React.useEffect(() => {
    if (error) enqueueSnackbar(t('error-message'), { variant: 'error' });
  }, [error]);

  const sxWidths = [0, 0, '18em', '18em', '22em'];

  return (
    <StyledDrawer
      variant="permanent"
      anchor="right"
      sx={{
        width: sxWidths,
        '& .MuiDrawer-paper': {
          width: sxWidths,
        },
      }}
    >
      <Container>
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
                  onSelectTask={setSelectedTask}
                />
              );
            })
          ) : (
            <Subtext>{t('no-text-info')}</Subtext>
          ))}
        {loading && (
          <Subtext>
            <CircularProgress />
          </Subtext>
        )}
        {error && <Subtext>{t('error-message')}</Subtext>}
        <TaskDetailsDrawer
          task={selectedTask}
          onCloseDrawer={() => setSelectedTask(undefined)}
        />
      </Container>
    </StyledDrawer>
  );
};

export default Rightbar;
