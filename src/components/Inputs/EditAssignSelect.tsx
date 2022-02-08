import React from 'react';
import { useTranslation } from 'next-i18next';
import { Avatar, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { Task } from '../../entities';
import { useRoommatesQuery } from '../../lib/graphql/operations/roommates.graphql';
import {
  useAssignTaskMutation,
  useUnassignTaskMutation,
} from '../../lib/graphql/operations/task.graphql';
import { useSnackbar } from 'notistack';

type EditButtonProps = {
  task: Task;
};
const EditAssignSelect: React.FC<EditButtonProps> = ({ task }) => {
  const { t } = useTranslation('overview', { keyPrefix: 'TaskDetailsDrawer' });
  const { t: tc } = useTranslation('common');
  const { enqueueSnackbar } = useSnackbar();

  const { data: roommatesData } = useRoommatesQuery();
  const [useAssignTask] = useAssignTaskMutation({
    refetchQueries: ['Tasks', 'OpenTasks'],
  });
  const [useUnassignTask] = useUnassignTaskMutation({
    refetchQueries: ['Tasks', 'OpenTasks'],
  });

  return (
    <Select
      displayEmpty
      sx={{
        '& div': {
          padding: '0 0 0 0.5em ',
        },
      }}
      value={''}
      size={'small'}
      onChange={(event) => handleAssigneeSelect(event, task)}
    >
      <MenuItem value="">
        <em>{tc('edit')}</em>
      </MenuItem>
      {roommatesData &&
        roommatesData.home?.users.map((user) => {
          return (
            <MenuItem key={user.id} value={user.id}>
              <Avatar
                sx={{ width: 24, height: 24, marginRight: 1 }}
                alt={user.name}
                src={user.picture}
              />
              {user.name}
            </MenuItem>
          );
        })}
      {task.assignee && (
        <MenuItem value="unassign">
          <em>{tc('unassign')}</em>
        </MenuItem>
      )}
    </Select>
  );

  async function handleAssigneeSelect(event: SelectChangeEvent, task: Task) {
    const value = event.target.value;

    if (value !== '') {
      if (value === String(task.assignee?.id)) {
        enqueueSnackbar(t('already-assigned-info'), {
          variant: 'info',
        });
      } else {
        if (value === 'unassign') {
          try {
            await useUnassignTask({ variables: { task: task.id } });
            enqueueSnackbar(t('unassign-success'), {
              variant: 'success',
            });
          } catch (e) {
            enqueueSnackbar(t('unassign-error'), {
              variant: 'error',
            });
          }
        } else {
          try {
            await useAssignTask({
              variables: { task: task.id, user: value },
            });

            enqueueSnackbar(t('assign-success'), {
              variant: 'success',
            });
          } catch (e) {
            enqueueSnackbar(t('assign-error'), {
              variant: 'error',
            });
          }
        }
      }
    }
  }
};

export default EditAssignSelect;
