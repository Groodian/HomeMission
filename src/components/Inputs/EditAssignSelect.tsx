import React from 'react';
import { useTranslation } from 'next-i18next';
import { Avatar, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { Task, User } from '../../entities';
import { useRoommatesQuery } from '../../lib/graphql/operations/roommates.graphql';
import {
  useAssignTaskMutation,
  useUnassignTaskMutation,
} from '../../lib/graphql/operations/task.graphql';
import { useSnackbar } from 'notistack';

// Supporting component that displays users avatar and name next to each other (also used in TaskDetailsDrawer)
export const AvatarAndName: React.FC<{
  user: User;
}> = ({ user }) => {
  return (
    <span style={{ display: 'flex', overflow: 'clip', marginTop: '0.2em' }}>
      <Avatar
        sx={{ width: 24, height: 24, marginRight: 1 }}
        alt={user.name}
        src={user.picture}
      />
      {user.name}
    </span>
  );
};

type EditButtonProps = {
  task: Task;
};
const EditAssignSelect: React.FC<EditButtonProps> = ({ task }) => {
  const { t } = useTranslation('overview', { keyPrefix: 'TaskDetailsDrawer' });
  const { t: tc } = useTranslation('common');
  const { enqueueSnackbar } = useSnackbar();

  const { data: roommatesData } = useRoommatesQuery();
  const [assignTask] = useAssignTaskMutation({
    refetchQueries: ['Tasks', 'OpenTasks'],
  });
  const [unassignTask] = useUnassignTaskMutation({
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
      onChange={handleAssigneeSelect}
    >
      <MenuItem value="">
        <em>{tc('edit')}</em>
      </MenuItem>
      {roommatesData &&
        roommatesData.home?.users.map((user) => {
          return (
            <MenuItem key={user.id} value={user.id}>
              <AvatarAndName user={user as User} />
            </MenuItem>
          );
        })}
      {task.assignee && <MenuItem value="unassign">{tc('unassign')}</MenuItem>}
    </Select>
  );

  async function handleAssigneeSelect(event: SelectChangeEvent) {
    const value = event.target.value;

    // check that something was selected, that selected assignee is not already assigned, and then differentiate between a person and the unassign option
    if (value !== '') {
      if (value === String(task.assignee?.id)) {
        enqueueSnackbar(t('already-assigned-info'), {
          variant: 'info',
        });
      } else {
        if (value === 'unassign') {
          try {
            await unassignTask({ variables: { task: task.id } });
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
            await assignTask({
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
