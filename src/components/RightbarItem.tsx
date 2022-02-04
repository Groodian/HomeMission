import React from 'react';
import { Task } from '../entities';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import { Container } from '@material-ui/core';
import { Badge, Avatar, Tooltip } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import LoopIcon from '@mui/icons-material/Loop';
import { useCreateTaskReceiptMutation } from '../lib/graphql/operations/taskreceipt.graphql';

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

type RightBarItemProps = {
  task: Task;
  picture?: string;
  recurring?: boolean;
};
const RightbarItem: React.FC<RightBarItemProps> = ({
  task,
  picture,
  recurring,
}) => {
  const { t } = useTranslation('common', { keyPrefix: 'Rightbar' });
  const router = useRouter();

  const [useCreateReceipt, { loading }] = useCreateTaskReceiptMutation({
    refetchQueries: ['Tasks', 'UpcomingTasks'],
  });

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
        <LoadingButton
          sx={{ width: '100%', marginTop: '0.5em' }}
          variant={'outlined'}
          color={'success'}
          loading={loading}
          onClick={() => {
            useCreateReceipt({ variables: { task: task.id } }).catch((_err) => {
              // ... send error toast
            });
          }}
        >
          {t('complete')}
        </LoadingButton>
      </TaskContainer>
    </Badge>
  );
};

export default RightbarItem;
