import React from 'react';
import {
  Avatar,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { TasksQuery } from '../../lib/graphql/operations/task.graphql';
import InlineDiamond from '../InlineDiamond';
import { TaskDetailsContext } from '../../pages/_app';

type TaskAtDateDialogProps = {
  tasksAtDate?: TasksQuery['tasks'];
  onCloseDialog?: () => void;
};
const TasksAtDateDialog: React.FC<TaskAtDateDialogProps> = ({
  tasksAtDate,
  onCloseDialog = () => undefined,
}) => {
  const { t } = useTranslation('overview');
  const router = useRouter();
  const { setSelectedTask } = React.useContext(TaskDetailsContext);

  return tasksAtDate ? (
    <Dialog open={true} onClose={onCloseDialog} aria-labelledby="dialog-title">
      <DialogTitle id="dialog-title">
        {t('all-tasks-at', {
          date: new Date(tasksAtDate[0]?.date).toLocaleDateString(
            router.locale
          ),
        })}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          {tasksAtDate.map((task) => {
            const user = task.receipt?.completer || task.assignee || undefined;
            return (
              <Chip
                key={task.id}
                label={
                  <>
                    <strong>{task.type.name}</strong>: {task.type.points}{' '}
                    <InlineDiamond verticalAlign="middle" />
                  </>
                }
                color={task.receipt ? 'success' : undefined}
                avatar={
                  user && (
                    <Avatar
                      src={user.picture}
                      alt={user.name}
                      sx={{
                        width: 24,
                        height: 24,
                        display: 'inline-block',
                        verticalAlign: 'middle',
                      }}
                    />
                  )
                }
                onClick={() => {
                  onCloseDialog();
                  setSelectedTask(task.id);
                }}
              />
            );
          })}
        </Stack>
      </DialogContent>
    </Dialog>
  ) : null;
};

export default TasksAtDateDialog;
