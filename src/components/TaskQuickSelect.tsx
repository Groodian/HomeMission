import React from 'react';
import { Task } from '../entities';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import { Container } from '@material-ui/core';
import { Button } from '@mui/material';

// TODO:
//  - show if user is assigned
//  - show if task is recurring

const TaskContainer = styled(Container)(({ theme }) => ({
  bgcolor: theme.palette.background.paper,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '-1px 1px 7px 0px rgba(255,255,255,0.15)'
      : '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
  borderRadius: 8,
  padding: '0.6em',
  overflowX: 'auto',
  marginBottom: '1.2em',
}));

const TaskText = styled('span')({
  paddingRight: '1.2em',
  display: 'inline-block',
});

type TaskQuickSelectProps = {
  task: Task;
  _picture?: string;
  _recurring?: boolean;
};
const TaskQuickSelect: React.FC<TaskQuickSelectProps> = ({
  task,
  _picture,
  _recurring,
}) => {
  const { t } = useTranslation(['TaskQuickSelect']);
  const router = useRouter();

  return (
    <TaskContainer>
      <TaskText
        sx={{
          fontSize: '1.1em',
          fontWeight: 'bold',
        }}
      >
        {task.type?.name}
      </TaskText>
      <TaskText>
        {task.type?.points} {t('points')}
      </TaskText>
      <TaskText sx={{ color: (theme) => theme.palette.text.secondary }}>
        {new Date(task.date).toLocaleString(router.locale).split(',')[0]}
      </TaskText>
      <Button
        sx={{ width: '100%', marginTop: '0.5em' }}
        variant={'outlined'}
        color={'success'}
      >
        {t('complete')}
      </Button>
    </TaskContainer>
  );
};

export default TaskQuickSelect;
