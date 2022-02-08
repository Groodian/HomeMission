import React from 'react';
import { LoadingButton } from '@mui/lab';
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
  series_all,
  series_sub,
}
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

  const buttonText =
    type === Type.single
      ? t('delete-single')
      : type === Type.series_all
      ? t('delete-series-all')
      : t('delete-series-sub');

  return (
    <LoadingButton
      sx={{ width: '100%', marginTop: '0.5em' }}
      variant={'outlined'}
      color={'error'}
      loading={loadingSingle || loadingSeriesAll || loadingSeriesSub}
      onClick={async () => {
        switch (type) {
          case Type.single:
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
            break;
          case Type.series_all:
            if (task.series)
              try {
                await useDeleteTaskSeries({
                  variables: { series: task.series?.id },
                });
                enqueueSnackbar(t('delete-series-all-success'), {
                  variant: 'success',
                });
              } catch (e) {
                enqueueSnackbar(t('delete-series-all-error'), {
                  variant: 'error',
                });
              }
            break;
          case Type.series_sub:
            if (task.series)
              try {
                await useDeleteTaskSeriesSubsection({
                  variables: { series: task.series?.id, start: task.id },
                });
                enqueueSnackbar(t('delete-series-sub-success'), {
                  variant: 'success',
                });
              } catch (e) {
                enqueueSnackbar(t('delete-series-sub-error'), {
                  variant: 'error',
                });
              }
            break;
        }
      }}
    >
      {buttonText}
    </LoadingButton>
  );
};

export default DeleteButton;
