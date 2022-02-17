import React from 'react';
import {
  Container,
  Divider,
  IconButton,
  styled,
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import Task from '../../entities/task';
import { useTranslation } from 'next-i18next';
import StyledDrawer from '../StyledDrawer';
import CompleteButton from '../Inputs/CompleteButton';
import { useRouter } from 'next/router';
import EditAssignSelect, { AvatarAndName } from '../Inputs/EditAssignSelect';
import DeleteButton, { Type } from '../Inputs/DeleteButton';
import InlineDiamond from '../InlineDiamond';

// Structural components
const Section = styled(Container)({
  padding: '1em 0 !important',
});
const FlexSpan = styled('span')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

// Text components
const Text = styled(Typography)({
  wordBreak: 'break-word',
  fontSize: '1.1em',
});
const TextMuted = styled(Text)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));
const Header = styled(Text)({
  fontSize: '1.3em',
  fontWeight: 'bold',
});
const Subheader = styled(Text)({
  fontWeight: 'bold',
});

type TaskDetailsDrawerProps = {
  task?: Task;
  onCloseDrawer?: () => void;
};
const TaskDetailsDrawer: React.FC<TaskDetailsDrawerProps> = ({
  task,
  onCloseDrawer = () => undefined,
}) => {
  const { t } = useTranslation('overview', { keyPrefix: 'TaskDetailsDrawer' });

  const router = useRouter();

  const sxWidths = ['none', 'none', '18em', '18em', '22em'];

  const HeaderSection = task && (
    <Section>
      <FlexSpan>
        <Header>{t('task-details')}</Header>
        <IconButton
          sx={{ justifyContent: 'flex-end', padding: '16 16px' }}
          onClick={onCloseDrawer}
        >
          <Close />
        </IconButton>
      </FlexSpan>
      {!task.receipt && <CompleteButton task={task} />}
    </Section>
  );

  const TaskSection = task && (
    <Section>
      <Subheader>{task.type?.name}</Subheader>
      <Text>
        {task.type?.points} <InlineDiamond />
      </Text>
      <TextMuted>
        {new Date(task.date).toLocaleDateString(router.locale)}
      </TextMuted>
    </Section>
  );

  const AssigneeSection = task && (
    <Section>
      <FlexSpan>
        <Subheader>
          {task.assignee ? t('assignee') : t('no-assignee')}
        </Subheader>
        <EditAssignSelect task={task} />
      </FlexSpan>
      {task.assignee && <AvatarAndName user={task.assignee} />}
    </Section>
  );

  const CompleterSection = task && task.receipt && task.receipt.completer && (
    <Section>
      <Subheader>{t('completed-by')}</Subheader>
      <AvatarAndName user={task.receipt.completer} />
      <TextMuted sx={{ fontSize: '0.9em' }}>
        {t('completed-time', {
          date: new Date(task.receipt.completionDate).toLocaleDateString(
            router.locale
          ),
          time: new Date(task.receipt.completionDate).toLocaleTimeString(
            router.locale
          ),
        })}
      </TextMuted>
    </Section>
  );

  const DeleteSection = task && (
    <Section>
      <DeleteButton task={task} type={Type.single} />
      {task.series && <DeleteButton task={task} type={Type.series} />}
    </Section>
  );

  return (
    <StyledDrawer
      variant="persistent"
      anchor="right"
      open={task !== undefined}
      sx={{
        width: sxWidths,
        '& .MuiDrawer-paper': {
          width: sxWidths,
        },
      }}
    >
      {task && (
        <Container>
          {HeaderSection}
          <Divider />
          {TaskSection}
          <Divider />
          {task.receipt ? CompleterSection : AssigneeSection}
          <Divider />
          {DeleteSection}
        </Container>
      )}
    </StyledDrawer>
  );
};

export default TaskDetailsDrawer;
