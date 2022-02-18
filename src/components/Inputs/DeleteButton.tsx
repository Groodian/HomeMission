import React from 'react';
import { ButtonGroup, Tooltip } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useTranslation } from 'next-i18next';
import Task from '../../entities/task';
import { useDeleteTaskMutation } from '../../lib/graphql/operations/task.graphql';
import {
  useDeleteTaskSeriesMutation,
  useDeleteTaskSeriesSubsectionMutation,
} from '../../lib/graphql/operations/taskseries.graphql';
import { useSnackbar } from 'notistack';

export enum Type {
  single,
  series,
}

type DeleteButtonProps = {
  task: Task;
  type: Type;
};
const DeleteButton: React.FC<DeleteButtonProps> = ({ task, type }) => {
  const { t } = useTranslation('overview', { keyPrefix: 'TaskDetailsDrawer' });
  const { enqueueSnackbar } = useSnackbar();

  const refetchOptions = { refetchQueries: ['Tasks', 'OpenTasks', 'History'] };
  const [deleteTask, { loading: loadingSingle }] =
    useDeleteTaskMutation(refetchOptions);
  const [deleteTaskSeries, { loading: loadingSeriesAll }] =
    useDeleteTaskSeriesMutation(refetchOptions);
  const [deleteTaskSeriesSubsection, { loading: loadingSeriesSub }] =
    useDeleteTaskSeriesSubsectionMutation(refetchOptions);

  return type === Type.single ? (
    <LoadingButton
      loading={loadingSingle}
      onClick={handleOnClickSingle}
      fullWidth
      color="error"
    >
      {t('delete-single')}
    </LoadingButton>
  ) : (
    <ButtonGroup sx={{ marginTop: '0.5em' }}>
      <Tooltip title={t('delete-series-all-tooltip') as string}>
        <LoadingButton
          loading={loadingSeriesAll}
          onClick={handleOnClickAll}
          fullWidth
          color="error"
        >
          {t('delete-series-all')}
        </LoadingButton>
      </Tooltip>
      <Tooltip title={t('delete-series-sub-tooltip') as string}>
        <LoadingButton
          loading={loadingSeriesSub}
          onClick={handleOnClickSub}
          fullWidth
          color="error"
        >
          {t('delete-series-sub')}
        </LoadingButton>
      </Tooltip>
    </ButtonGroup>
  );

  async function handleOnClickSingle() {
    try {
      await deleteTask({ variables: { task: task.id } });
      enqueueSnackbar(t('delete-single-success'), {
        variant: 'success',
      });
    } catch (e) {
      enqueueSnackbar(t('delete-single-error'), {
        variant: 'error',
      });
    }
  }

  async function handleOnClickAll() {
    if (task.series)
      try {
        await deleteTaskSeries({
          variables: { series: task.series.id },
        });
        enqueueSnackbar(t('delete-series-all-success'), {
          variant: 'success',
        });
      } catch (e) {
        enqueueSnackbar(t('delete-series-all-error'), {
          variant: 'error',
        });
      }
  }

  async function handleOnClickSub() {
    if (task.series)
      try {
        await deleteTaskSeriesSubsection({
          variables: { series: task.series.id, start: task.id },
        });
        enqueueSnackbar(t('delete-series-sub-success'), {
          variant: 'success',
        });
      } catch (e) {
        enqueueSnackbar(t('delete-series-sub-error'), {
          variant: 'error',
        });
      }
  }
};

export default DeleteButton;
