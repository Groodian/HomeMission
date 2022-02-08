import React from 'react';
import {
  Avatar,
  Container,
  Divider,
  IconButton,
  styled,
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { Task } from '../entities';
import { useTranslation } from 'next-i18next';
import StyledDrawer from './StyledDrawer';
import CompleteButton from './Inputs/CompleteButton';
import { useRouter } from 'next/router';
import EditAssignSelect from './Inputs/EditAssignSelect';
import DeleteButton, { Type } from './Inputs/DeleteButton';

const Text = styled(Typography)({
  wordBreak: 'break-word',
  fontSize: '1.1em',
});
const TextLg = styled(Text)({
  fontSize: '1.3em',
});
const Segment = styled('span')({
  display: 'inline-block',
  marginRight: '1.5em',
});
const SegmentFlex = styled('span')({
  display: 'flex',
  flexWrap: 'wrap',
  // marginRight: '1.5em',
});
const TextSub = styled(Text)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.9em',
}));
const TextSubLg = styled(TextSub)({
  fontSize: '1.1em',
});

type TaskDetailsDrawerProps = {
  task: Task | undefined;
  onCloseDrawer?: () => void;
};
const TaskDetailsDrawer: React.FC<TaskDetailsDrawerProps> = ({
  task,
  onCloseDrawer = () => undefined,
}) => {
  const { t } = useTranslation('overview', { keyPrefix: 'TaskDetailsDrawer' });

  const router = useRouter();

  const sxWidths = ['none', 'none', '15em', '15em', '20em'];

  return task ? (
    <StyledDrawer
      variant="persistent"
      anchor="right"
      open={true}
      sx={{
        width: sxWidths,
        '& .MuiDrawer-paper': {
          width: sxWidths,
        },
      }}
    >
      <Container>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <TextLg>{t('task-details')}</TextLg>
          <IconButton
            sx={{ justifyContent: 'flex-end', padding: '16 16px' }}
            onClick={onCloseDrawer}
          >
            <Close fontSize={'medium'} />
          </IconButton>
        </span>
        {!task.receipt && <CompleteButton task={task} />}
      </Container>

      <Container>
        <Divider />
        <Text>
          <Segment sx={{ fontWeight: 'bold' }}>{task.type?.name}</Segment>
          <br />
          <Segment>{task.type?.points} Points</Segment>
        </Text>
        <TextSubLg>
          {new Date(task.date).toLocaleString(router.locale).split(',')[0]}
        </TextSubLg>
        <Divider />
        {task.assignee ? (
          <>
            <SegmentFlex sx={{ justifyContent: 'space-between' }}>
              <Text>Assignee</Text>
              <EditAssignSelect task={task} />
            </SegmentFlex>
            <SegmentFlex sx={{ flexWrap: 'initial', overflow: 'clip' }}>
              <Avatar
                sx={{ width: 24, height: 24, marginRight: 1 }}
                alt={task.assignee.name}
                src={task.assignee.picture}
              />
              {task.assignee.name}
            </SegmentFlex>
          </>
        ) : (
          <SegmentFlex
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              width: '100%',
              margin: 'initial',
            }}
          >
            <Text>No Assignee</Text>
            <EditAssignSelect task={task} />
          </SegmentFlex>
        )}
        <Divider />
        {task.receipt && (
          <>
            <Text>{t('completed-by')}</Text>
            <SegmentFlex sx={{ flexWrap: 'initial', overflow: 'clip' }}>
              <Avatar
                sx={{ width: 24, height: 24, marginRight: 1 }}
                alt={task.receipt.completer?.name}
                src={task.receipt.completer?.picture}
              />
              {task.receipt.completer?.name}
            </SegmentFlex>
            <TextSub>
              {t('date-on')}{' '}
              {
                new Date(task.receipt.completionDate)
                  .toLocaleString(router.locale)
                  .split(',')[0]
              }{' '}
              {t('date-at')}{' '}
              {
                new Date(task.receipt.completionDate)
                  .toLocaleString(router.locale)
                  .split(',')[1]
              }{' '}
            </TextSub>
          </>
        )}
        <Divider />
        <DeleteButton task={task} type={Type.single} />
        {task.series && (
          <>
            <DeleteButton task={task} type={Type.series_all} />
            <DeleteButton task={task} type={Type.series_sub} />
          </>
        )}
      </Container>
    </StyledDrawer>
  ) : (
    <></>
  );
};

export default TaskDetailsDrawer;
