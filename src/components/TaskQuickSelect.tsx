import React from 'react';
import { Task } from '../entities';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import { Container } from '@material-ui/core';
import { Badge, Button, Avatar, Tooltip } from '@mui/material';
import LoopIcon from '@mui/icons-material/Loop';

// TODO:
//  - make button functional

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
  picture?: string;
  recurring?: boolean;
};
const TaskQuickSelect: React.FC<TaskQuickSelectProps> = ({
  task,
  picture,
  recurring,
}) => {
  const { t } = useTranslation(['TaskQuickSelect']);
  const router = useRouter();

  const avatar = picture && (
    <Tooltip title={t('tooltip-avatar') as string}>
      <Avatar
        sx={{ width: 36, height: 36 }}
        alt={task.assignee?.name}
        src={picture}
      />
    </Tooltip>
  );

  const RecurringIcon = (
    <Tooltip title={t('tooltip-loop') as string}>
      <LoopIcon
        sx={{ verticalAlign: 'sub', marginLeft: '0.25em' }}
        fontSize={'small'}
      />
    </Tooltip>
  );

  return (
    <Badge style={{ width: '100%' }} badgeContent={avatar}>
      <TaskContainer>
        <TaskText
          sx={{
            fontSize: '1.1em',
            fontWeight: 'bold',
          }}
        >
          {task.type?.name}
        </TaskText>
        <br />
        <TaskText>
          {task.type?.points} {t('points')}
        </TaskText>
        <TaskText sx={{ color: (theme) => theme.palette.text.secondary }}>
          {new Date(task.date).toLocaleString(router.locale).split(',')[0]}
          {recurring && RecurringIcon}
        </TaskText>
        <Button
          sx={{ width: '100%', marginTop: '0.5em' }}
          variant={'outlined'}
          color={'success'}
        >
          {t('complete')}
        </Button>
      </TaskContainer>
    </Badge>
  );
};

export default TaskQuickSelect;
