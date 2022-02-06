import React from 'react';
import { LoadingButton } from '@mui/lab';
import { useTranslation } from 'next-i18next';
import { Task, TaskReceipt } from '../../entities';
import { useCreateTaskReceiptMutation } from '../../lib/graphql/operations/taskreceipt.graphql';

type CompleteButtonProps = {
  task: Task;
  onComplete?: (receipt: TaskReceipt) => void;
};
const CompleteButton: React.FC<CompleteButtonProps> = ({
  task,
  onComplete = () => undefined,
}) => {
  const { t } = useTranslation('common');

  const [useCreateReceipt, { loading }] = useCreateTaskReceiptMutation({
    refetchQueries: ['Tasks', 'OpenTasks'],
  });

  return (
    <LoadingButton
      sx={{ width: '100%', marginTop: '0.5em' }}
      variant={'outlined'}
      color={'success'}
      loading={loading}
      onClick={() => {
        useCreateReceipt({ variables: { task: task.id } })
          .then((res) => {
            onComplete(res.data?.createTaskReceipt as TaskReceipt);
            // ... send success message
          })
          .catch((_err) => {
            // ... send error toast
          });
      }}
    >
      {t('complete')}
    </LoadingButton>
  );
};

export default CompleteButton;
