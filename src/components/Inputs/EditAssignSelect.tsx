import React from 'react';
import { useTranslation } from 'next-i18next';
import { Avatar, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { Task } from '../../entities';
import { useRoommatesQuery } from '../../lib/graphql/operations/roommates.graphql';
import {
  useAssignTaskMutation,
  useUnassignTaskMutation,
} from '../../lib/graphql/operations/task.graphql';

type EditButtonProps = {
  task: Task;
};
const EditAssignSelect: React.FC<EditButtonProps> = ({ task }) => {
  const { t } = useTranslation('common');

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
        <em>{t('edit')}</em>
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
          <em>{t('unassign')}</em>
        </MenuItem>
      )}
    </Select>
  );

  function handleAssigneeSelect(event: SelectChangeEvent, task: Task) {
    const value = event.target.value;

    if (value !== '') {
      if (value === String(task.assignee?.id)) {
        // ... inform that selected user is already assigned
      } else {
        if (value === 'unassign') {
          useUnassignTask({ variables: { task: task.id } })
            .then((_data) => {
              // ... inform that assignee was removed
            })
            .catch((_err) => {
              // ... inform that attempt to remove assignee failed
            });
        } else {
          useAssignTask({
            variables: { task: task.id, user: value },
          })
            .then((_data) => {
              // ... inform that user was assigned
            })
            .catch((_err) => {
              // ... inform that attempt to assign user failed
            });
        }
      }
    }
  }
};

export default EditAssignSelect;
