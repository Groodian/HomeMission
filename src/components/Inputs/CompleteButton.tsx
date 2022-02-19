import React from 'react';
import { LoadingButton } from '@mui/lab';
import { useTranslation } from 'next-i18next';
import Task from '../../entities/task';
import TaskReceipt from '../../entities/taskreceipt';
import { useCreateTaskReceiptMutation } from '../../lib/graphql/operations/taskreceipt.graphql';
import { useSnackbar } from 'notistack';

type CompleteButtonProps = {
  task: Task;
  onComplete?: (receipt: TaskReceipt) => void;
};
const CompleteButton: React.FC<CompleteButtonProps> = ({
  task,
  onComplete = () => undefined,
}) => {
  const { t } = useTranslation('common');
  const { enqueueSnackbar } = useSnackbar();

  const [createReceipt, { loading }] = useCreateTaskReceiptMutation({
    refetchQueries: 'all',
  });

  return (
    <LoadingButton
      sx={{ width: '100%', marginTop: '0.5em' }}
      color="success"
      loading={loading}
      onClick={async () => {
        try {
          const res = await createReceipt({ variables: { task: task.id } });
          enqueueSnackbar(t('complete-success'), {
            variant: 'success',
          });
          onComplete(res.data?.createTaskReceipt as TaskReceipt);
        } catch (e) {
          enqueueSnackbar(t('complete-error'), {
            variant: 'error',
          });
        }
      }}
    >
      {t('complete')}
    </LoadingButton>
  );
};

export default CompleteButton;
