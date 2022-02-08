import React from 'react';
import { ButtonGroup, Tooltip } from '@mui/material';
import { LoadingButton, LoadingButtonProps } from '@mui/lab';
import { useTranslation } from 'next-i18next';
import { Task } from '../../entities';
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

const DeleteButtonSkeleton: React.FC<LoadingButtonProps> = (props) => {
  return (
    <LoadingButton
      sx={{ width: '100%' }}
      variant={'outlined'}
      color={'error'}
      loading={props.loading}
      onClick={props.onClick}
    >
      {props.children}
    </LoadingButton>
  );
};

type DeleteButtonProps = {
  task: Task;
  type: Type;
};
const DeleteButton: React.FC<DeleteButtonProps> = ({ task, type }) => {
  const { t } = useTranslation('overview', { keyPrefix: 'TaskDetailsDrawer' });
  const { enqueueSnackbar } = useSnackbar();

  const refetchOptions = { refetchQueries: ['Tasks', 'OpenTasks'] };
  const [useDeleteTask, { loading: loadingSingle }] =
    useDeleteTaskMutation(refetchOptions);
  const [useDeleteTaskSeries, { loading: loadingSeriesAll }] =
    useDeleteTaskSeriesMutation(refetchOptions);
  const [useDeleteTaskSeriesSubsection, { loading: loadingSeriesSub }] =
    useDeleteTaskSeriesSubsectionMutation(refetchOptions);

  return type === Type.single ? (
    <DeleteButtonSkeleton loading={loadingSingle} onClick={handleOnClickSingle}>
      {t('delete-single')}
    </DeleteButtonSkeleton>
  ) : (
    <ButtonGroup sx={{ marginTop: '0.5em' }}>
      <Tooltip title={t('delete-series-all-tooltip') as string}>
        <DeleteButtonSkeleton
          loading={loadingSeriesAll}
          onClick={handleOnClickAll}
        >
          {t('delete-series-all')}
        </DeleteButtonSkeleton>
      </Tooltip>
      <Tooltip title={t('delete-series-sub-tooltip') as string}>
        <DeleteButtonSkeleton
          loading={loadingSeriesSub}
          onClick={handleOnClickSub}
        >
          {t('delete-series-sub')}
        </DeleteButtonSkeleton>
      </Tooltip>
    </ButtonGroup>
  );

  async function handleOnClickSingle() {
    try {
      await useDeleteTask({ variables: { task: task.id } });
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
        await useDeleteTaskSeries({
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
        await useDeleteTaskSeriesSubsection({
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
